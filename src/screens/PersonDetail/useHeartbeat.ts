import * as React from 'react';

import { MulticastObservable } from '../../utils/Observable';

/**
 * https://youtu.be/MCi6AZMkxcU
 */
function animationInterval(ms: number, signal: AbortSignal, callback: (time: number) => void) {
  // Prefer currentTime, as it'll better sync animtions queued in the
  // same frame, but if it isn't supported, performance.now() is fine.
  const start = document.timeline?.currentTime ?? performance.now();

  function frame(time: number) {
    if (signal.aborted) return;
    callback(time);
    scheduleFrame(time);
  }

  function scheduleFrame(time: number) {
    const elapsed = time - start;
    const roundedElapsed = Math.round(elapsed / ms) * ms;
    const targetNext = start + roundedElapsed + ms;
    const delay = targetNext - performance.now();
    setTimeout(() => requestAnimationFrame(frame), delay);
  }

  scheduleFrame(start);
}

function createHeartbeatObservable() {
  return new MulticastObservable<number>((observer) => {
    const controller = new AbortController();

    animationInterval(1000 * 60 * 60, controller.signal, (time) => {
      observer.next(time);
    });

    return () => {
      controller.abort();
    };
  });
}

const GLOBAL_KEY = '__Shared$HeartbeatObservable__';
const w = window as any;
w[GLOBAL_KEY] = w[GLOBAL_KEY] ?? createHeartbeatObservable();
const heartbeatObservable: MulticastObservable<number> = w[GLOBAL_KEY];

export function useHeartbeat() {
  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = heartbeatObservable.subscribe((time) => {
      // this only serves the purpose of a forced re-render
      forceUpdate(time);
    });

    return () => {
      unsubscribe();
    };
  }, []);
}
