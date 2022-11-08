import { Temporal } from '@js-temporal/polyfill';
import { createResource, For } from 'solid-js';
import type { Component, JSX } from 'solid-js';

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
          const offset = tz.getOffsetStringFor?.(Temporal.Now.instant());
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

interface TimezonePickerProps
  extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {}

export const TimezonePicker: Component<TimezonePickerProps> = (props) => {
  const [options] = createResource(() => lazyTimezoneOptions);

  return (
    <select {...props} class="picker min-w-full" required>
      <For each={options()}>{({ label, value }) => <option value={value}>{label}</option>}</For>
    </select>
  );
};
