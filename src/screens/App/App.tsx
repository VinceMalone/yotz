import {
  identity,
  useEncodedQueryParamState,
  useQueryParamState,
} from '../../state/useQueryParamState';
import type { MeterViewMode, Person } from '../../types';
import { AddPerson } from '../AddPerson';
import { Dev } from '../Dev';
import { PersonDetail } from '../PersonDetail';

import { MeterViewModePicker } from './MeterViewModePicker';
import { TimeFormatSwitch } from './TimeFormatSwitch';

export function App() {
  const [meterViewMode, setMeterViewMode] = useQueryParamState<MeterViewMode>(
    'meterview',
    (val) => (val ?? 'whole_day') as MeterViewMode,
    identity,
  );

  const [personState = [], setPersonState] = useEncodedQueryParamState<Person[]>('_');

  function handleAdd(newPerson: Person) {
    setPersonState([newPerson, ...personState]);
  }

  function handleDelete(person: Person) {
    setPersonState(personState.filter(({ id }) => id !== person.id));
  }

  function handleMove(person: Person, delta: number) {
    const personIndex = personState.findIndex(({ id }) => id === person.id);
    const newIndex = Math.min(Math.max(personIndex + delta, 0), personState.length - 1);
    const state = personState.filter(({ id }) => id !== person.id);
    setPersonState([...state.slice(0, newIndex), person, ...state.slice(newIndex)]);
  }

  function handleMoveDown(person: Person, delta: number) {
    handleMove(person, delta);
  }

  function handleMoveUp(person: Person, delta: number) {
    handleMove(person, delta * -1);
  }

  return (
    <div className="p-6 space-y-12">
      <header className="flex items-end space-x-8">
        <MeterViewModePicker onChange={setMeterViewMode} value={meterViewMode} />
        <TimeFormatSwitch />
        <AddPerson onAdd={handleAdd} />
      </header>
      {personState.map((person, index) => (
        <PersonDetail
          key={person.id}
          meterViewMode={meterViewMode}
          onDelete={handleDelete}
          onMoveDown={index + 1 < personState.length ? handleMoveDown : undefined}
          onMoveUp={index > 0 ? handleMoveUp : undefined}
          person={person}
        />
      ))}
      <Dev personState={personState} setPersonState={setPersonState} />
    </div>
  );
}
