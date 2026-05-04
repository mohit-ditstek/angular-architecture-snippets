import { Directive, Input } from '@angular/core';
import { UntypedFormControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[isCheck][maxDate][minDate][minDateValidation][maxDateValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: MaxDateValidatorDirective,
      useExisting: MaxDateValidatorDirective,
      multi: true,
    },
  ],
})
export class MaxDateValidatorDirective implements Validator {
  validator: ValidatorFn;

  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() isCheck = false;
  @Input() minDateValidation = false;
  
  constructor() {
    this.validator = this.maxDateValidator();
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }

  maxDateValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      const controlDate = new Date(control.value);
      if (control.value && this.isCheck) {  
        const isValid = this.minDateValidation ? controlDate >= this.minDate : controlDate <= this.maxDate;
        if (isValid) {
          return null;
        } else {
          return {
            maxDateValidator: { valid: false },
          };
        }
      } else {
        return null;
      }
    };
  }
}
