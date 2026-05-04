import { Directive, ElementRef, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, ValidatorFn, UntypedFormControl } from '@angular/forms';
import { UtilityService } from '@app/shared/services';

@Directive({
  selector: '[dateValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: DateValidatorDirective,
      multi: true,
    },
  ],
})
export class DateValidatorDirective implements Validator {
  validator: ValidatorFn;

  constructor(private el: ElementRef, private utilityService: UtilityService) {
    this.validator = this.dateValidator();
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }

  dateValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      if (control.value) {
        const isValid = this.utilityService.isValidDate(control.value);
        if (isValid) {
          const dateTime =  new Date(control.value).getTime();
          const minDate = this.el?.nativeElement.getAttribute('minDate');
          const maxDate = this.el?.nativeElement.getAttribute('maxDate');

          const minTime = new Date(minDate).getTime();
          const maxTime = new Date(maxDate).getTime();

          if (dateTime < minTime) return { minDateValidator: { valid: false } };
          if (dateTime > maxTime) return { maxDateValidator: { valid: false } };

          return null;
        }

        return {
          dateValidator: { valid: false },
        };
      }

      return null;
    };
  }
}
