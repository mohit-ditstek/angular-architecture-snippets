import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { BaseMaskingComponent } from '@app/base';
import { EventService, UtilityService } from '@app/shared/services';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent extends BaseMaskingComponent implements AfterViewInit {
  @Input() maskedValue = true;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() required?: boolean;
  @Input() submitted?: boolean;
  @Input() disabled?: boolean;
  @Input() readonly?: boolean;
  @Input() min = new Date(1900, 0, 1);
  @Input() max = new Date(2099, 11, 31);
  @Input() tabindex?: number;
  @Input() override showMasked = false;
  @Input() showOnFocus = true;

  @Input() minErrorMessage = '';
  @Input() maxErrorMessage = '';

  @Output() changeDate = new EventEmitter<any>();

  @ViewChild('controlName') inputControl: NgModel;

  override defaultMaskedFormat = 'XX/XX/XXXX';
  override partialMaskedFormat = 'XX/XX/0000';
  override unmaskedFormat = '00/00/0000';

  maskingChars: string = null;
  inputValue = '';

  initialized = false;
  private _selectedValue?: string;

  @Input()
  get selectedValue(): string {
    return this._selectedValue;
  }
  set selectedValue(value: string) {
    this._selectedValue = value;
    if (this.initialized) {
      if (value) this.setControlValue(new Date(value));
      else this.inputValue = null;
    }
  }

  maskFormat = 'MM/DD/YYYY';

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(public override eventService: EventService, @Optional() public override ngForm: NgForm, private utilityService: UtilityService) {
    super(eventService, ngForm);
  }

  ngAfterViewInit() {
    this.addControls();
    this.setHiddentInput();
    this.initMasking();

    setTimeout(() => {
      if (this.value) this.setControlValue(new Date(this.value));
      this.initialized = true;
    }, 10);

    this.inputUpdate.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      const invalid = this.inputControl.hasError('mask') || this.inputControl.hasError('dateValidator');
      this.valueChanged(value, invalid);
    });
  }

  setHiddentInput() {
    setTimeout(() => (this.hiddenInput = !!this.showMasked), 0);
  }

  focusIn(_e, _focus = true) {
    if (this.showOnFocus) this.hiddenInput = false;
  }

  focusOut() {
    if (this.showOnFocus) {
      this.maskedFormat = this.defaultMaskedFormat;
      this.hiddenInput = true;
    }
  }

  valueChanged(value, invalid?: boolean) {
    if (!value) {
      this.value = null;
      return;
    }

    if (invalid) return;

    const date = new Date(value);
    this.setControlValue(date);

    setTimeout(() => {
      this.value = this.utilityService.formatDate(date, 'yyyy-MM-ddT00:00:00');
      this.changeDate.emit(this.value);
    }, 0);
  }

  dateChange(e) {
    const value = e.target.value;
    this.value = this.utilityService.formatDate(value, 'yyyy-MM-ddT00:00:00');

    this.setControlValue(value);

    this.ngModels.forEach((m) => {
      m.control.markAsUntouched();
    });

    this.utilityService.raiseCustomFieldChangeEvent();
    this.changeDate.emit(this.value);
  }

  setControlValue(value: Date) {
    this.inputValue = this.utilityService.formatDate(value, 'MM/dd/yyyy');
  }

  get minDate() {
    return this.utilityService.formatDate(this.min, 'yyyy-MM-ddT00:00:00');
  }

  get maxDate() {
    return this.utilityService.formatDate(this.max, 'yyyy-MM-ddT00:00:00');
  }
}
