import { Directive, ElementRef, Input } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[abcAmountValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: AmountValidatorDirective,
      multi: true,
    },
  ],
})
export class AmountValidatorDirective implements Validator {
  @Input() required = false;

  validator: ValidatorFn;
  constructor(private elementRef: ElementRef) {
    this.validator = this.amountValidator();
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }

  amountValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      const { value } = control;
      const required = this.elementRef.nativeElement.hasAttribute('required');
      const allowZero = this.elementRef?.nativeElement.getAttribute('allowZero');
      if (allowZero?.toUpperCase() === 'TRUE') return null;

      if (required && (!value || value <= 0)) {
        return {
          amountValidator: { valid: false },
        };
      }
      return null;
    };
  }
}
