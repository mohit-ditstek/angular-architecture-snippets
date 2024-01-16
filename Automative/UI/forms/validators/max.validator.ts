import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, UntypedFormControl } from '@angular/forms';

@Directive({
  selector: '[customMax]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomMaxDirective, multi: true }],
})
export class CustomMaxDirective implements Validator {
  @Input()
  customMax: number;

  validate(c: UntypedFormControl): { [key: string]: any } {
    if(this.customMax == null || this.customMax == undefined) {
      return null;
    }
    const v = c.value;
    
    return v > this.customMax ? { customMax: true } : null;
  }
}