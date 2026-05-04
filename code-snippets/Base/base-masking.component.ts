import { Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventService } from '@app/shared/services';
import { BaseFormControl } from 'libs/shared/ui/src/lib/forms/base';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

export abstract class BaseMaskingComponent extends BaseFormControl<number | string> {
  hiddenInput?: boolean;
  unMask: boolean;
  hasFullPermission: boolean;

  public subscription = new Subscription();
  public inputUpdate = new Subject<number | string>();

  maskedFormat: string;
  dynamicMasking = false;
  showMasked = true;
  abstract defaultMaskedFormat: string;
  abstract partialMaskedFormat: string;
  abstract unmaskedFormat: string;

  constructor(public eventService: EventService, @Optional() public override ngForm: NgForm) {
    super(ngForm);

    this.inputUpdate.pipe(debounceTime(100), distinctUntilChanged()).subscribe((value) => {
      this.inputChanged(value);
    });

    this.eventService.togglePIIObservable$.subscribe(([unMask, hasFullPermission]) => {
      if (!this.showMasked) return;

      const input = (this.value || '').toString();
      if (!input) {
        this.maskedFormat = this.unmaskedFormat;
        return;
      }

      this.hiddenInput = true;

      this.hasFullPermission = hasFullPermission;
      this.unMask = unMask;

      if (!unMask) {
        this.maskedFormat = this.defaultMaskedFormat;
        return;
      }

      if (this.hasFullPermission) {
        this.maskedFormat = this.unmaskedFormat;
        return;
      }
      this.maskedFormat = this.determinePartialMasking();
    });

    this.eventService.resetMaskingObservable$.subscribe(() => {
      const input = (this.value || '').toString();
      if (!input) {
        this.maskedFormat = this.unmaskedFormat;
        return;
      }
      this.maskedFormat = this.defaultMaskedFormat;
    });
  }

  initMasking() {
    this.hiddenInput = this.showMasked;
    this.maskedFormat = this.defaultMaskedFormat;
    setTimeout(() => this.inputChanged(this.value), 500);
  }

  inputChanged(value: string | number) {
    if (!value) this.maskedFormat = this.unmaskedFormat;
  }

  determinePartialMasking() {
    // Return Partial Masked format directly
    if (!this.dynamicMasking) return this.partialMaskedFormat;

    const input = (this.value || '').toString();
    if (!input) {
      return this.unmaskedFormat;
    }

    const maskedChar = 'X';
    const unmaskedChar = 'Y';
    const length = input.length;
    if (length > 4) {
      const hiddenCharsCount = input.length - 4;
      return `${maskedChar.repeat(hiddenCharsCount)}${unmaskedChar.repeat(25 - hiddenCharsCount)}`;
    }
    return `${maskedChar.repeat(25)}`;
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
