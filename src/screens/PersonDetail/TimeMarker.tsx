import type { Component } from 'solid-js';

import { hour12Signal } from '../../state/hour12';

interface TimeMarkerProps {
  hour: number;
  minute: number;
}

export const TimeMarker: Component<TimeMarkerProps> = (props) => {
  const [hour12] = hour12Signal;

  const formattedTime = () => {
    const time = new Date();
    time.setHours(props.hour, props.minute, 0, 0);

    return time.toLocaleTimeString(undefined, {
      hourCycle: hour12() ? 'h12' : 'h23',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div class="relative z-20 w-0.5 bg-black">
      {/* <div class="absolute px-2 pt-1"> */}
      {/* <div class="absolute -top-2 transform -translate-y-full -translate-x-2/4"> */}
      <div class="absolute -top-2 transform -translate-y-full">
        <div class="font-mono text-black text-xs whitespace-nowrap">{formattedTime()}</div>
      </div>
    </div>
  );
};
