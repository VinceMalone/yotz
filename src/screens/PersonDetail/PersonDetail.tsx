import { createMemo } from 'solid-js';
import type { Component } from 'solid-js';

import { meterViewModeSignal } from '../../state/queryParamSignals';
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
  onDelete(person: Person): void;
  onMoveDown?(person: Person, delta: number): void;
  onMoveUp?(person: Person, delta: number): void;
  person: Person;
}

export const PersonDetail: Component<PersonDetailProps> = (props) => {
  const [meterViewMode] = meterViewModeSignal;
  const info = createMemo(() => getMeterTimeProps(meterViewMode(), props.person));

  function handleDelete() {
    const message = `Are you sure you want to delete ${props.person.name} in "${props.person.timezone}"?`;
    if (window.confirm(message)) {
      props.onDelete(props.person);
    }
  }

  return (
    <article class="space-y-2">
      <header class="flex items-center justify-between space-x-8">
        <div>
          <h1 class="text-2xl">{props.person.name}</h1>
          <p class="text-base">{props.person.timezone}</p>
        </div>
        <div class="space-x-2">
          <button
            aria-label="Move up"
            class="icon-button"
            disabled={props.onMoveUp == null}
            onClick={() => props.onMoveUp?.(props.person, 1)}
          >
            ⬆️
          </button>
          <button
            aria-label="Move down"
            class="icon-button"
            disabled={props.onMoveDown == null}
            onClick={() => props.onMoveDown?.(props.person, 1)}
          >
            ⬇️
          </button>
          <button aria-label="Delete" class="icon-button" onClick={handleDelete}>
            🗑
          </button>
        </div>
      </header>
      <Meter
        color={props.person.theme.meterBackgroundColor}
        highlightHourStart={props.person.workingHours.start}
        highlightLength={props.person.workingHours.length}
        hourStart={info().start}
        length={info().length}
        timeZone={props.person.timezone}
      />
    </article>
  );
};
