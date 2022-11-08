import { For, Show } from 'solid-js';
import type { Component } from 'solid-js';

import { personsSignal } from '../../state/queryParamSignals';
import type { Person } from '../../types';
import { AddPerson } from '../AddPerson';
import { PersonDetail } from '../PersonDetail';

import { MeterViewModePicker } from './MeterViewModePicker';
import { TimeFormatSwitch } from './TimeFormatSwitch';

export const Home: Component = () => {
  const [personState, setPersonState] = personsSignal;

  function handleAdd(newPerson: Person) {
    setPersonState([newPerson, ...personState()]);
  }

  function handleDelete(person: Person) {
    setPersonState(personState().filter(({ id }) => id !== person.id));
  }

  function handleMove(person: Person, delta: number) {
    const personIndex = personState().findIndex(({ id }) => id === person.id);
    const newIndex = Math.min(Math.max(personIndex + delta, 0), personState().length - 1);
    const state = personState().filter(({ id }) => id !== person.id);
    setPersonState([...state.slice(0, newIndex), person, ...state.slice(newIndex)]);
  }

  function handleMoveDown(person: Person, delta: number) {
    handleMove(person, delta);
  }

  function handleMoveUp(person: Person, delta: number) {
    handleMove(person, delta * -1);
  }

  const empty = () => personState().length === 0;

  return (
    <div class="p-6 space-y-12">
      <header class="flex items-end space-x-8">
        <AddPerson autoOpen={empty()} onAdd={handleAdd} />
        <div class="flex-1 flex flex-col sm:flex-row items-end justify-end space-y-2 sm:space-y-0 sm:space-x-8">
          <TimeFormatSwitch />
          <MeterViewModePicker />
        </div>
      </header>
      <Show
        when={!empty()}
        fallback={
          <section class="text-center space-y-2 py-6">
            <p>📭</p>
            <h1 class="font-semibold text-xl">Empty — add a person</h1>
          </section>
        }
      >
        <For each={personState()}>
          {(person, index) => (
            <PersonDetail
              onDelete={handleDelete}
              onMoveDown={index() + 1 < personState().length ? handleMoveDown : undefined}
              onMoveUp={index() > 0 ? handleMoveUp : undefined}
              person={person}
            />
          )}
        </For>
      </Show>
    </div>
  );
};
