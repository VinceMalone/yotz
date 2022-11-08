import type { Component } from 'solid-js';

import { hour12Signal } from '../../state/hour12';

export const TimeFormatSwitch: Component = () => {
  const [hour12, setHour12] = hour12Signal;

  return (
    <div class="flex items-center space-x-2 h-8">
      <label class="leading-tight" for="hour-12__switch">
        Use 12 hour time format
      </label>
      <input
        checked={hour12()}
        id="hour-12__switch"
        onChange={(event) => setHour12(event.currentTarget.checked)}
        type="checkbox"
      />
    </div>
  );
};
