import { AfterViewInit, Component, ElementRef, forwardRef, Input, Optional, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { BaseFormControl } from '../../../forms/base';

@Component({
  selector: 'app-text-mask-input',
  templateUrl: './text-mask-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextMaskInputComponent),
      multi: true,
    },
  ],
})
export class TextMaskInputComponent extends BaseFormControl<string> implements AfterViewInit {
  @Input() mask?: string;
  @Input() maskFormat?: string;
  @Input() maskedValue = false;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() required?: boolean;
  @Input() submitted?: boolean;
  @Input() disableControl = false;
  @Input() readonly?: boolean;
  @Input() showNote?: string;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() thousandSeparator = '';
  @Input() separatorLimit = '';
  @Input() maxlength?: number;
  @Input() minlength? = null;
  @Input() tabindex: number;
  @Input() maxValue: number;
  @Input() minValue: number;
  @Input() className: string;
  @Input() hiddenInput = false;
  @Input() validation? = true;
  @Input() autoFocus = false;
  @Input() allowNegativeNumbers = false;

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;
  @ViewChild('focusInput') focusInput: ElementRef;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngAfterViewInit() {
    this.addControls();
    if (this.autoFocus) {
      setTimeout(() => this.focusInput.nativeElement.focus(), 150);
    }
  }
}
