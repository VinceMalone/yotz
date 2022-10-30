import { Temporal } from '@js-temporal/polyfill';
import * as React from 'react';

const hoursInDay = Array.from({ length: 24 }, (_, i) => i);

/**
 * Convert a PlainTime instance to an ISO string — such as "09:00"
 */
function toTimeValue(time: Temporal.PlainTime): string {
  return time.toLocaleString(undefined, { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' });
}

const TimeOptions = React.memo(function TimeOptions() {
  return (
    <datalist id="working-hour-options">
      {hoursInDay.map((hour) => {
        const time = new Temporal.PlainTime(hour);
        return (
          <React.Fragment key={hour}>
            <option value={toTimeValue(time)} />
            <option value={toTimeValue(time.add({ minutes: 30 }))} />
          </React.Fragment>
        );
      })}
    </datalist>
  );
});

interface TimeRangeProps {
  endName: string;
  startName: string;
}

export const TimeRange = React.memo(function TimeRange({ endName, startName }: TimeRangeProps) {
  const [workingStartTime, setWorkingStartTime] = React.useState(() =>
    Temporal.PlainTime.from('09:00'),
  );
  const [workingEndTime, setWorkingEndTime] = React.useState(() =>
    Temporal.PlainTime.from('17:00'),
  );

  return (
    <div>
      <input
        aria-label="Start time"
        className="input"
        defaultValue="09:00"
        list="working-hour-options"
        max={toTimeValue(workingEndTime.subtract({ minutes: 30 }))}
        name={startName}
        onChange={(event) => setWorkingStartTime(Temporal.PlainTime.from(event.target.value))}
        step="1800"
        type="time"
      />
      {' – '}
      <input
        aria-label="End time"
        className="input"
        defaultValue="17:00"
        list="working-hour-options"
        min={toTimeValue(workingStartTime.add({ minutes: 30 }))}
        name={endName}
        onChange={(event) => setWorkingEndTime(Temporal.PlainTime.from(event.target.value))}
        step="1800"
        type="time"
      />
      <TimeOptions />
    </div>
  );
});
