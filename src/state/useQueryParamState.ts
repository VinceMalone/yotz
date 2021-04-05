import * as React from 'react';

export const identity = <T>(value: T) => value;

export function useQueryParamState<T = string | null>(
  name: string,
  deserialize: (value: string | null) => T,
  serialize: (value: T) => string | null,
): [T, (value: T) => void] {
  const [value, setValue] = React.useState(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  });

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

    setValue(serializedValue);
    window.history.pushState(undefined, '', url.toString());
  }

  return [deserialize(value), handleChange];
}

/**
 * Used to store structured data — base64 encoded — into a single query parameter.
 */
export function useEncodedQueryParamState<T>(
  paramKey: string,
): [T | undefined, (value: T) => void] {
  function deserialize(value: string | null): T | undefined {
    try {
      const data = atob(value ?? '');
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }

  function serialize(value: T | undefined): string | null {
    return value === undefined ? null : btoa(JSON.stringify(value));
  }

  return useQueryParamState(paramKey, deserialize, serialize);
}
