import type { ChangeEvent } from 'react';

import type { MeterViewMode } from '../../types';

interface MeterViewModePickerProps {
  onChange(mode: MeterViewMode): void;
  value: MeterViewMode;
}

export function MeterViewModePicker({ onChange, value }: MeterViewModePickerProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const meterViewMode = event.target.value as MeterViewMode;
    onChange(meterViewMode);
  }

  return (
    <div className="form-field">
      <label className="label" htmlFor="meter-view-mode__picker">
        View Mode
      </label>
      <select className="picker" id="meter-view-mode__picker" onChange={handleChange} value={value}>
        <option value={'whole_day' as MeterViewMode}>Whole day</option>
        <option value={'working_hours' as MeterViewMode}>Working hours</option>
        <option value={'working_hours_with_buffer' as MeterViewMode}>
          Working hours with buffer
        </option>
      </select>
    </div>
  );
}
