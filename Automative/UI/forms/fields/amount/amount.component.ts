import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyMaskConfig, CurrencyMaskInputMode } from 'ngx-currency';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmountComponent),
      multi: true,
    },
  ],
})
export class AmountComponent extends BaseFormControl<string> implements OnInit, AfterViewInit, OnDestroy {
  options: CurrencyMaskConfig;

  @Input() label = '';
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() readonly = false;
  @Input() disableControl = false;
  @Input() maskedValue = false;
  @Input() tabindex = 0;
  @Input() rightAlign = false;
  @Input() separatorLimit = 999999.99;
  @Input() prefix = '$ ';
  @Input() suffix = ' %';
  @Input() showSuffix = false;
  @Input() maxlength = 9;
  @Input() allowZero = false;
  @Input() autoFocus = false;
  @Input() maxValue: number;
  @Input() minValue: number;
  @Input() precision = 2;
  @Input() allowNegative = false;

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngOnInit(): void {
    this.options = {
      align: this.rightAlign ? 'right' : 'left',
      allowZero: this.allowZero,
      decimal: '.',
      precision: this.precision,
      prefix: !this.showSuffix ? this.prefix : '',
      suffix: this.showSuffix ? this.suffix : '',
      thousands: ',',
      nullable: this.allowZero,
      max: this.separatorLimit,
      allowNegative: this.allowNegative ,
      inputMode: CurrencyMaskInputMode.NATURAL,
    };
  }

  onFocus(e) {
    setTimeout(() => e.target.select(), 0);
  }

  ngAfterViewInit() {
    this.addControls();
  }

  ngOnDestroy() {
    this.removeControls();
  }
}
