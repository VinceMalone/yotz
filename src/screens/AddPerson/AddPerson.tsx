import * as React from 'react';
import type { FormEvent } from 'react';

import type { Person } from '../../types';

import { TimeRange } from './TimeRange';
import { TimezonePicker } from './TimezonePicker';

declare module 'react' {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    onCancel?: ReactEventHandler<T>;
    onClose?: ReactEventHandler<T>;
  }
}

const id = {
  meterBackgroundColor: 'add-person__meterBackgroundColor',
  name: 'add-person__name',
  timezone: 'add-person__timezone',
  workingHoursEnd: 'add-person__workingHoursEnd',
  workingHoursStart: 'add-person__workingHoursStart',
};

function getFormControlValue(form: HTMLFormElement, id: string): string {
  const element = form.elements.namedItem(id);
  if (element == null) {
    return '';
  }
  return (element as HTMLInputElement).value;
}

/**
 * Convert ISO time to number — "09:30" → 9.5
 */
function timeToNumber(value: string) {
  const [hour, minute] = value.split(':').map((n) => Number(n));
  return hour + minute / 60;
}

function useEffectOnce(effect: () => void) {
  React.useEffect(() => {
    effect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

interface AddPersonProps {
  autoOpen: boolean;
  onAdd(person: Person): void;
}

export function AddPerson({ autoOpen, onAdd }: AddPersonProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffectOnce(() => {
    if (autoOpen) {
      openDialog();
    }
  });

  function openDialog() {
    if (dialogRef.current && !dialogRef.current.open) {
      // backdrop is only displayed when dialog is opened with dialog.showModal()
      dialogRef.current.showModal();
    }
  }

  function resetForm() {
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  function handleClose() {
    resetForm();
    triggerRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const meterBackgroundColor = getFormControlValue(form, id.meterBackgroundColor);
    const name = getFormControlValue(form, id.name);
    const timezone = getFormControlValue(form, id.timezone);
    const workingHoursEnd = timeToNumber(getFormControlValue(form, id.workingHoursEnd));
    const workingHoursStart = timeToNumber(getFormControlValue(form, id.workingHoursStart));

    onAdd({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name,
      theme: {
        meterBackgroundColor,
      },
      timezone,
      workingHours: {
        start: workingHoursStart,
        length: workingHoursEnd - workingHoursStart,
      },
    });
  }

  return (
    <section>
      <button
        className="button--primary"
        onClick={() => openDialog()}
        ref={triggerRef}
        type="button"
      >
        Add person
      </button>
      <dialog
        aria-label="Add person"
        className="rounded-md shadow-lg z-50 min-w-dialog"
        onClose={handleClose}
        ref={dialogRef}
      >
        <form className="space-y-4" method="dialog" onSubmit={handleSubmit} ref={formRef}>
          <div className="form-field">
            <label className="label" htmlFor={id.name}>
              Name
            </label>
            <input className="input" id={id.name} name={id.name} required size={24} type="text" />
          </div>
          <div className="form-field">
            <label className="label" htmlFor={id.timezone}>
              Timezone
            </label>
            <TimezonePicker id={id.timezone} name={id.timezone} />
          </div>
          <fieldset className="border p-2">
            <legend className="label px-1">Working Hours</legend>
            <div className="space-y-4 px-1">
              <div className="form-field">
                <TimeRange endName={id.workingHoursEnd} startName={id.workingHoursStart} />
              </div>
              <div className="form-field">
                <label className="label" htmlFor={id.meterBackgroundColor}>
                  Background Color
                </label>
                <input
                  defaultValue="#ffffff"
                  id={id.meterBackgroundColor}
                  name={id.meterBackgroundColor}
                  type="color"
                />
              </div>
            </div>
          </fieldset>
          <div className="space-x-2">
            <button className="button--primary" type="submit">
              Add
            </button>
            <button
              className="button--secondary"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
