type RequestIdleCallback = (cb: (idleDeadline: any) => any) => number;

export const requestIdleCallback: RequestIdleCallback =
  (window as any).requestIdleCallback ?? ((cb: () => void) => cb());
