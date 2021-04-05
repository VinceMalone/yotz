import * as React from 'react';

import { useHour12State } from '../../state/hour12';

interface TimeMarkerProps {
  hour: number;
  minute: number;
}

export const TimeMarker = React.memo(function TimeMarker({ hour, minute }: TimeMarkerProps) {
  const [hour12] = useHour12State();

  /**
   * Use `Temporal.PlainTime` when it's native. The polyfill is way too slow
   * when formatting.
   *
   * ```
   * const time = new Temporal.PlainTime(hour, minute);
   * const formattedTime = time.toLocaleString(undefined, { ... });
   * ```
   */

  const time = new Date();
  time.setHours(hour, minute, 0, 0);

  const formattedTime = time.toLocaleTimeString(undefined, {
    hourCycle: hour12 ? 'h12' : 'h23',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="relative z-20 w-0.5 bg-black">
      {/* <div className="absolute px-2 pt-1"> */}
      {/* <div className="absolute -top-2 transform -translate-y-full -translate-x-2/4"> */}
      <div className="absolute -top-2 transform -translate-y-full">
        <div className="font-mono text-black text-xs whitespace-nowrap">{formattedTime}</div>
      </div>
    </div>
  );
});
