interface Theme {
  meterBackgroundColor?: string;
}

interface WorkingHours {
  start: number;
  length: number;
}

export interface Person {
  id: string;
  name: string;
  theme: Theme;
  timezone: string;
  workingHours: WorkingHours;
}

export type MeterViewMode = 'working_hours' | 'working_hours_with_buffer' | 'whole_day';
