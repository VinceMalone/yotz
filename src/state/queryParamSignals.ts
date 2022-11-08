import { createRoot, createSignal } from 'solid-js';
import type { Accessor, Setter } from 'solid-js';

import type { MeterViewMode, Person } from '../types';

const identity = <T>(value: T) => value;

function getQueryParamValue(name: string) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function createQueryParamSignal<T>(
  name: string,
  deserialize: (value: string | null) => T,
  serialize: (value: T) => string | null,
): [Accessor<T>, Setter<T>] {
  const initialValue = deserialize(getQueryParamValue(name));
  const [value, setValue] = createSignal(initialValue);

  function handleChange(newRawValue: T) {
    const url = new URL(window.location.href);

    let serializedValue: string | null;
    try {
      serializedValue = serialize(newRawValue);
    } catch {
      // If the value can't be serialized, don't set it
      return;
    }

    if (serializedValue == null) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, serializedValue);
    }

    setValue(() => newRawValue);
    window.history.pushState(undefined, '', url.toString());
  }

  return [value, handleChange as Setter<T>];
}

/**
 * Used to store structured data — base64 encoded — into a single query parameter.
 */
function createEncodedQueryParamSignal<T>(name: string, defaultValue: T): [Accessor<T>, Setter<T>] {
  function deserialize(value: string | null): T {
    try {
      const data = atob(value ?? '');
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  function serialize(value: T | undefined): string | null {
    return value === undefined ? null : btoa(JSON.stringify(value));
  }

  return createQueryParamSignal(name, deserialize, serialize);
}

// Singleton signals

export const meterViewModeSignal = createRoot(() =>
  createQueryParamSignal('meterview', (val) => (val ?? 'whole_day') as MeterViewMode, identity),
);

export const personsSignal = createRoot(() => createEncodedQueryParamSignal<Person[]>('_', []));
