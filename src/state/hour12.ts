import { useAtom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';

function getDefaultValue(): boolean {
  const format = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: 'numeric' });
  const resolvedOptions = format.resolvedOptions();
  return !!resolvedOptions.hour12;
}

function getStorageValue<T>(key: string, initialValue: T): T {
  try {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue !== null) {
      return JSON.parse(localStorageValue);
    } else {
      if (initialValue !== undefined) {
        localStorage.setItem(key, JSON.stringify(initialValue));
      }
      return initialValue;
    }
  } catch {
    // If user is in private mode or has storage restriction
    // localStorage can throw. JSON.parse and JSON.stringify
    // can throw, too.
    return initialValue;
  }
}

function setStorageValue<T>(key: string, value: T): void {
  try {
    const localStorageValue = JSON.stringify(value);
    localStorage.setItem(key, localStorageValue);
  } catch {
    // If user is in private mode or has storage restriction
    // localStorage can throw. Also JSON.stringify can throw.
  }
}

const storageKey = '12hour';

const hour12Atom = atomWithReducer(
  getStorageValue(storageKey, getDefaultValue()),
  (_, value: boolean) => {
    setStorageValue(storageKey, value);
    return value;
  },
);

export function useHour12State() {
  return useAtom(hour12Atom);
}
