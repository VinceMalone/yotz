import { Temporal } from 'proposal-temporal';
import * as React from 'react';
import type { SelectHTMLAttributes } from 'react';

import timezones from '../../__generated__/timezones.json';
import { requestIdleCallback } from '../../utils/requestIdleCallback';

// DEV
(window as any).___timezones = timezones;

// or, you know, this is pre-processed...
const lazyTimezoneOptions = new Promise<TimezoneOption[]>((resolve) => {
  requestIdleCallback(() => {
    resolve(
      timezones
        .map((timezone) => {
          const tz = Temporal.TimeZone.from(timezone.TZ);
          const offset = tz.getOffsetStringFor(Temporal.now.instant());
          return {
            label: `${timezone.TZ} (${offset})`,
            value: timezone.TZ,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    );
  });
});

interface TimezoneOption {
  label: string;
  value: string;
}

function useLazyTimezoneOptions(): TimezoneOption[] {
  const mountedRef = React.useRef(true);
  const [options, setOptions] = React.useState<TimezoneOption[]>([]);

  React.useEffect(() => {
    lazyTimezoneOptions.then((timezoneOptions) => {
      if (mountedRef.current) {
        setOptions(timezoneOptions);
      }
    });
  }, []);

  return options;
}

const TimezoneOptions = React.memo(function TimezoneOptions() {
  const options = useLazyTimezoneOptions();

  return (
    <>
      {options.map(({ label, value }) => {
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </>
  );
});

interface TimezonePickerProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {}

export function TimezonePicker(props: TimezonePickerProps) {
  return (
    <select {...props} className="picker min-w-full" required>
      <TimezoneOptions />
    </select>
  );
}
