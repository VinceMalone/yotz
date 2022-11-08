import { createMemo, For } from 'solid-js';
import type { Component } from 'solid-js';

import { Indicator } from './Indicator';
import { TimeMarker } from './TimeMarker';

interface MeterProps {
  color?: string;
  highlightHourStart: number;
  highlightLength: number;
  hourStart: number;
  length: number;
  timeZone: string;
}

export const Meter: Component<MeterProps> = (props) => {
  const hourEnd = () => props.hourStart + props.length;
  const highlightEndHour = () => props.highlightHourStart + props.highlightLength;

  const markers = createMemo(() => {
    const defaultColor = 'white';
    const highlightColor = props.color ?? defaultColor;
    return Array.from({ length: props.length }, (_, i) => {
      const hour = props.hourStart + i;
      const color =
        hour >= props.highlightHourStart && hour < highlightEndHour()
          ? highlightColor
          : defaultColor;
      return {
        color,
        hour,
      };
    });
  });

  return (
    <div class="pt-6">
      <div class="flex h-6 relative isolate">
        <For each={markers()}>
          {({ color, hour }) => (
            <>
              <TimeMarker hour={hour} minute={0} />
              <div class="flex-1" style={{ 'background-color': color }} />
            </>
          )}
        </For>
        <Indicator
          endHour={hourEnd()}
          endMinute={0}
          startHour={props.hourStart}
          startMinute={0}
          timeZone={props.timeZone}
        />
      </div>
    </div>
  );
};
