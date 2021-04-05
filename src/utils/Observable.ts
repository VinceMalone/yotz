interface Observer<T> {
  next(value: T): void;
  // error(error: unknown): void;
  // complete(): void;
}

type Teardown = () => void;

export class MulticastObservable<T> {
  #init: (observer: Observer<T>) => Teardown;
  #subscriptions: Set<Subscription<T>> = new Set();
  #teardown: Teardown | undefined;

  constructor(init: (observer: Observer<T>) => Teardown) {
    this.#init = init;
  }

  subscribe(next: (value: T) => void): Teardown {
    const subscription = new Subscription({ next });
    this.#subscriptions.add(subscription);

    if (this.#subscriptions.size === 1) {
      this.#teardown = this.#init(
        new Subscription({
          next: (value: T) => {
            for (const subscription of this.#subscriptions) {
              subscription.next(value);
            }
          },
        }),
      );
    }

    return () => {
      this.#subscriptions.delete(subscription);
      subscription.unsubscribe();

      if (this.#subscriptions.size === 0) {
        this.#teardown?.();
        this.#teardown = undefined;
      }
    };
  }
}

class Subscription<T> {
  #observer: Observer<T>;
  #subscribed = false;

  constructor(observer: Observer<T>) {
    this.#observer = observer;
    this.#subscribed = true;
  }

  next(value: T) {
    if (!this.#subscribed) {
      return;
    }

    this.#observer.next(value);
  }

  unsubscribe() {
    this.#subscribed = false;
  }
}
