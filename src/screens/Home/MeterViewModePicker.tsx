import type { Component } from 'solid-js';

import { meterViewModeSignal } from '../../state/queryParamSignals';
import type { MeterViewMode } from '../../types';

export const MeterViewModePicker: Component = () => {
  const [value, onChange] = meterViewModeSignal;

  return (
    <div class="form-field">
      <label class="label" for="meter-view-mode__picker">
        View Mode
      </label>
      <select
        class="picker"
        id="meter-view-mode__picker"
        onChange={(event) => onChange(event.currentTarget.value as MeterViewMode)}
        value={value()}
      >
        <option value={'whole_day' as MeterViewMode}>Whole day</option>
        <option value={'working_hours' as MeterViewMode}>Working hours</option>
        <option value={'working_hours_with_buffer' as MeterViewMode}>
          Working hours with buffer
        </option>
      </select>
    </div>
  );
};
