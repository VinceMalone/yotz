import type { MeterViewMode, Person } from '../../types';

import { Meter } from './Meter';

function getMeterTimeProps(mode: MeterViewMode, person: Person): { start: number; length: number } {
  switch (mode) {
    case 'whole_day':
      return { start: 0, length: 24 };
    case 'working_hours':
      return { start: person.workingHours.start, length: person.workingHours.length };
    case 'working_hours_with_buffer':
      return { start: person.workingHours.start - 2, length: person.workingHours.length + 4 };
    default:
      throw new Error(`View Mode "${mode}" is not supported`);
  }
}

interface PersonDetailProps {
  meterViewMode: MeterViewMode;
  onDelete(person: Person): void;
  onMoveDown?(person: Person, delta: number): void;
  onMoveUp?(person: Person, delta: number): void;
  person: Person;
}

export function PersonDetail({
  meterViewMode,
  onDelete,
  onMoveDown,
  onMoveUp,
  person,
}: PersonDetailProps) {
  const { start, length } = getMeterTimeProps(meterViewMode, person);

  function handleDelete() {
    const message = `Are you sure you want to delete ${person.name} in "${person.timezone}"?`;
    if (window.confirm(message)) {
      onDelete(person);
    }
  }

  return (
    <article className="space-y-2">
      <header className="flex items-center justify-between space-x-8">
        <div>
          <h1 className="text-2xl">{person.name}</h1>
          <p className="text-base">{person.timezone}</p>
        </div>
        <div className="space-x-2">
          <button
            aria-label="Move up"
            className="icon-button"
            disabled={onMoveUp == null}
            onClick={() => onMoveUp?.(person, 1)}
          >
            ⬆️
          </button>
          <button
            aria-label="Move down"
            className="icon-button"
            disabled={onMoveDown == null}
            onClick={() => onMoveDown?.(person, 1)}
          >
            ⬇️
          </button>
          <button aria-label="Delete" className="icon-button" onClick={handleDelete}>
            🗑
          </button>
        </div>
      </header>
      <Meter
        color={person.theme.meterBackgroundColor}
        highlightHourStart={person.workingHours.start}
        highlightLength={person.workingHours.length}
        hourStart={start}
        length={length}
        timeZone={person.timezone}
      />
    </article>
  );
}
