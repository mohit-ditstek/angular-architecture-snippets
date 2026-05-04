import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, ValidatorFn, UntypedFormControl } from '@angular/forms';

@Directive({
  selector: '[phoneValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: PhoneValidatorDirective,
      multi: true
    }
  ]
})
export class PhoneValidatorDirective implements Validator {

  validator: ValidatorFn;
  constructor() {
    this.validator = this.phoneValidator();
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }

  phoneValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      if (control.value != null && control.value !== '') {
        const isValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(control.value);
        if (isValid) {
          return null;
        } else {
          return {
            phoneValidator: { valid: false }
          };
        }
      } else {
        return null;
      }
    };
  }
}