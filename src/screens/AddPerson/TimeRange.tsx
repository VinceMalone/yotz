import { Temporal } from '@js-temporal/polyfill';
import { createSignal, For } from 'solid-js';
import type { Component } from 'solid-js';

const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

/**
 * Convert a PlainTime instance to an ISO string — such as "09:00"
 */
function toTimeValue(time: Temporal.PlainTime): string {
  return time.toLocaleString(undefined, { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' });
}

interface TimeRangeProps {
  endName: string;
  startName: string;
}

export const TimeRange: Component<TimeRangeProps> = ({ endName, startName }) => {
  const [workingStartTime, setWorkingStartTime] = createSignal('09:00');
  const [workingEndTime, setWorkingEndTime] = createSignal('17:00');

  return (
    <div>
      <input
        aria-label="Start time"
        class="input"
        list="working-hour-options"
        max={toTimeValue(Temporal.PlainTime.from(workingEndTime()).subtract({ minutes: 30 }))}
        name={startName}
        onChange={(event) => setWorkingStartTime(event.currentTarget.value)}
        step="1800"
        type="time"
        value={workingStartTime()}
      />
      {' – '}
      <input
        aria-label="End time"
        class="input"
        list="working-hour-options"
        min={toTimeValue(Temporal.PlainTime.from(workingStartTime()).add({ minutes: 30 }))}
        name={endName}
        onChange={(event) => setWorkingEndTime(event.currentTarget.value)}
        step="1800"
        type="time"
        value={workingEndTime()}
      />
      <datalist id="working-hour-options">
        <For each={hoursInDay}>
          {(hour) => {
            const time = new Temporal.PlainTime(hour);
            return (
              <>
                <option value={toTimeValue(time)} />
                <option value={toTimeValue(time.add({ minutes: 30 }))} />
              </>
            );
          }}
        </For>
      </datalist>
    </div>
  );
};
