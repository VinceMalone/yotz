import { Temporal } from 'proposal-temporal';
import * as React from 'react';

import { useHeartbeat } from './useHeartbeat';

function round(num: number) {
  return Math.round((num + Number.EPSILON) * 1000000) / 1000000;
}

interface DayTimeDescriptor {
  hour: number;
  minute: number;
}

function currentPercent(
  start: DayTimeDescriptor,
  end: DayTimeDescriptor,
  timeZone: string,
  nowInstant: Temporal.Instant = Temporal.now.instant(),
) {
  const { calendar } = new Intl.DateTimeFormat().resolvedOptions();
  const now = nowInstant.toZonedDateTime({ calendar, timeZone });
  const startOfDay = now.startOfDay();
  const startSeconds = startOfDay.add({ hours: start.hour, minutes: start.minute }).epochSeconds;
  const endSeconds = startOfDay.add({ hours: end.hour, minutes: end.minute }).epochSeconds;
  const deltaNow = now.epochSeconds - startSeconds;
  const deltaRange = endSeconds - startSeconds;
  const ratio = deltaNow / deltaRange;
  return round(ratio);
}

interface IndicatorProps {
  endHour: number;
  endMinute: number;
  startHour: number;
  startMinute: number;
  timeZone: string;
}

export const Indicator = React.memo(function Indicator({
  endHour,
  endMinute,
  startHour,
  startMinute,
  timeZone,
}: IndicatorProps) {
  useHeartbeat();

  const pxWidth = 2;

  /**
   * Looking into a performance concern? It's probably this function — the
   * Temporal polyfill is slow — this function can take upwards of 8ms to run.
   */
  const left = currentPercent(
    { hour: startHour, minute: startMinute },
    { hour: endHour, minute: endMinute },
    timeZone,
    // Temporal.Instant.from('2000-01-01T12:00:00-05:00'),
  );

  return (
    <div
      className="absolute z-20 -top-2 -bottom-3 min-h-full w-0.5 bg-red-500"
      style={{ left: `calc(${left * 100}% - ${pxWidth * left}px)` }}
    >
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-2 w-2 rounded-full bg-red-500" />
    </div>
  );
});
