import { AfterViewInit, Component, ElementRef, forwardRef, Input, Optional, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyComponent),
      multi: true,
    },
  ],
})
export class CurrencyComponent extends BaseFormControl<number> implements AfterViewInit {
  @ViewChild('input') input: ElementRef;
  @ViewChild('controlName') ngControl: NgModel;

  @Input() label = '';
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() readonly = false;
  @Input() disableControl = false;
  @Input() tabindex = 0;
  @Input() rightAlign = true;
  @Input() prefix = '$ ';
  @Input() autoFocus? = false;
  @Input() maxValue: number;
  @Input() separatorLimit = '999999';

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  focus() {
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);
  }

  ngAfterViewInit() {
    this.addControls();
    setTimeout(() => this.focusOut(), 0); 
    
    if (this.autoFocus) {
      this.focus();
    }
  }

  inputChanged(value: number) {
    this.setValue(isNaN(value) ? 0 : value);
  }

  focusOut() {
    this.input.nativeElement.value = this.prefix + this.value.toFixed(2);
  }

  setValue(value) {
    this.ngControl.control.setValue(value);
  }

}
