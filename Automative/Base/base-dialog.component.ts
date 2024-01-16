import { Directive, EventEmitter, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseDialogComponent {
  form?: NgForm;

  subscription = new Subscription();
  save = new EventEmitter<object>();
  dialogRef: MatDialogRef<any>;

  submitting = false;

  @HostListener('window:keydown.control.s', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (!this.form) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.submitting) this.submit();
  }

  handleFormSubmit() {
    // Need to override in extended class
  }

  handleClose(_data: any) {
    // Need to override in extended class
  }

  submit() {
    if (this.isFormValid()) {
      if (this.isFormDirty()) {
        this.handleFormSubmit();
        this.submitting = true;
      } else this.close();
    } else {
      this.handleValidationError();
    }
  }

  handleValidationError() {
    this.markAllAsTouched();

    // scroll to required fields
    const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      (firstInvalidControl.querySelector('input, mat-select,select') as HTMLElement)?.focus();
    }
  }

  close(data?: any) {
    this.dialogRef.close(data);
  }

  public isFormValid() {
    return this.form?.valid;
  }

  public isFormDirty() {
    return this.form?.dirty;
  }

  public markAsDirty() {
    this.form.form.markAsDirty();
  }

  public markAsPristine() {
    this.form.form.markAsPristine();
  }

  public markAllAsTouched() {
    this.form.form.markAllAsTouched();
  }

  destroy(): void {
    this.subscription.unsubscribe();
  }
}
