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
      <summary>Dev tools</summary>
      <div className="pt-4 space-y-4">
        <form aria-label="Set JSON state" className="space-y-2" onSubmit={handleSetPersonState}>
          <div className="form-field">
            <label className="label" htmlFor="dev__current-state">
              Current state
            </label>
            <textarea
              className="border border-gray-500 font-mono text-sm w-full"
              defaultValue={JSON.stringify(personState, null, 2)}
              id="dev__current-state"
              name="state-json"
              rows={24}
            />
          </div>
          <div className="space-x-2">
            <button className="button--primary" type="submit">
              set
            </button>
            <button className="button--secondary" type="reset">
              reset
            </button>
          </div>
        </form>
        <button
          className="button--primary"
          onClick={() => setPersonState(mockPersonState)}
          type="button"
        >
          set state to mock data
        </button>
      </div>
    </details>
  );
}
