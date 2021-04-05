import type { FormEvent } from 'react';

import type { Person } from '../../types';

import mockPersonState from './mockPersonState.json';

interface DevProps {
  personState: Person[];
  setPersonState(state: Person[]): void;
}

export function Dev({ personState, setPersonState }: DevProps) {
  function handleSetPersonState(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const json = (form[0] as HTMLTextAreaElement).value;
    setPersonState(JSON.parse(json));
  }

  return (
    <details>
      <summary>Dev</summary>
      <div className="pt-4 space-y-4">
        <button
          className="button--primary"
          onClick={() => setPersonState(mockPersonState)}
          type="button"
        >
          reset state to default
        </button>
        <form aria-label="Set JSON state" className="space-y-2" onSubmit={handleSetPersonState}>
          <textarea
            className="border border-gray-500 font-mono text-sm w-full"
            rows={24}
            defaultValue={JSON.stringify(personState, null, 2)}
            name="state-json"
          />
          <div className="space-x-2">
            <button className="button--primary" type="submit">
              set
            </button>
            <button className="button--secondary" type="reset">
              reset
            </button>
          </div>
        </form>
      </div>
    </details>
  );
}
