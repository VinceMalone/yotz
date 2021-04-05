import * as React from 'react';

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

export function Meter({
  color = 'white',
  highlightHourStart,
  highlightLength,
  hourStart,
  length,
  timeZone,
}: MeterProps) {
  const hourEnd = hourStart + length;
  const highlightEndHour = highlightHourStart + highlightLength;

  return (
    <div className="pt-6">
      <div className="flex h-6 relative isolate">
        {Array(Math.ceil(length))
          .fill(null)
          .map((_, i) => {
            const hour = hourStart + i;
            const highlightColor =
              hour >= highlightHourStart && hour < highlightEndHour ? color : 'white';

            return (
              <React.Fragment key={hour}>
                <TimeMarker hour={hour} minute={0} />
                <div className="flex-1" style={{ backgroundColor: highlightColor }} />
              </React.Fragment>
            );
          })}
        <Indicator
          endHour={hourEnd}
          endMinute={0}
          startHour={hourStart}
          startMinute={0}
          timeZone={timeZone}
        />
      </div>
    </div>
  );
}
