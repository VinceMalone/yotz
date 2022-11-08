import { onMount } from 'solid-js';
import type { Component, JSX } from 'solid-js';

import type { Person } from '../../types';

import { TimeRange } from './TimeRange';
import { TimezonePicker } from './TimezonePicker';

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

interface AddPersonProps {
  autoOpen: boolean;
  onAdd(person: Person): void;
}

export const AddPerson: Component<AddPersonProps> = ({ autoOpen, onAdd }) => {
  let triggerRef: HTMLButtonElement | undefined;
  let dialogRef: HTMLDialogElement | undefined;
  let formRef: HTMLFormElement | undefined;

  onMount(() => {
    if (autoOpen) {
      openDialog();
    }
  });

  function openDialog() {
    if (dialogRef && !dialogRef.open) {
      // backdrop is only displayed when dialog is opened with dialog.showModal()
      dialogRef.showModal();
    }
  }

  function resetForm() {
    if (formRef) {
      formRef.reset();
    }
  }

  function handleClose() {
    resetForm();
    triggerRef?.focus();
  }

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
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
  };

  return (
    <section>
      <button class="button--primary" onClick={() => openDialog()} ref={triggerRef} type="button">
        Add person
      </button>
      <dialog
        aria-label="Add person"
        class="rounded-md shadow-lg z-50 min-w-dialog"
        onClose={handleClose}
        ref={dialogRef}
      >
        <form class="space-y-4" method="dialog" onSubmit={handleSubmit} ref={formRef}>
          <div class="form-field">
            <label class="label" for={id.name}>
              Name
            </label>
            <input class="input" id={id.name} name={id.name} required size={24} type="text" />
          </div>
          <div class="form-field">
            <label class="label" for={id.timezone}>
              Timezone
            </label>
            <TimezonePicker id={id.timezone} name={id.timezone} />
          </div>
          <fieldset class="border p-2">
            <legend class="label px-1">Working Hours</legend>
            <div class="space-y-4 px-1">
              <div class="form-field">
                <TimeRange endName={id.workingHoursEnd} startName={id.workingHoursStart} />
              </div>
              <div class="form-field">
                <label class="label" for={id.meterBackgroundColor}>
                  Background Color
                </label>
                <input
                  id={id.meterBackgroundColor}
                  name={id.meterBackgroundColor}
                  type="color"
                  value="#ffffff"
                />
              </div>
            </div>
          </fieldset>
          <div class="space-x-2">
            <button class="button--primary" type="submit">
              Add
            </button>
            <button class="button--secondary" onClick={() => dialogRef?.close()} type="button">
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
};
