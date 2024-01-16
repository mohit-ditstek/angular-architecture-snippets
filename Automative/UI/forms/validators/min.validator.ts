import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, UntypedFormControl } from '@angular/forms';

@Directive({
  selector: '[customMin]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomMinDirective, multi: true }],
})
export class CustomMinDirective implements Validator {
  @Input()
  customMin: number;

  validate(c: UntypedFormControl) {
    const inputValue = c.value;
    if (inputValue == null || inputValue.length === 0) return null;

    const value = parseFloat(inputValue || 0);
    return value < this.customMin ? { customMin: true } : null;
  }
}
