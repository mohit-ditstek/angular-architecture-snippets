import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { ConfigItemType, FieldType, Option } from '@app/entities';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-field-wrapper',
  templateUrl: './field-wrapper.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldWrapperComponent),
      multi: true,
    },
  ],
})
export class FieldWrapperComponent extends BaseFormControl<any> implements OnInit, AfterViewInit {
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  @Input() type: number;
  @Input() name: string;
  @Input() required = false;

  @Input() maxlength: number;
  @Input() submitted = false;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() autoFocus = false;
  @Input() disableControl = false;
  @Input() showCheckBoxLabel = true;
  @Input() pattern: string;
  @Input() patternMessageKey: string;

  // textarea
  @Input() rows: number;

  // numeric
  @Input() minValue: number;
  @Input() maxValue: number;

  // Config Item dropdown
  @Input() configItemType: ConfigItemType;

  // radio and multi select dropdown
  @Input() options: Option[] = [];
  @Input() interchangeOption = false;

  fieldOptions: Option[] = [];

  // file upload
  accept: string;
  allowedTypes: string[];

  @Output() valueChanges = new EventEmitter<string>();
  @ViewChild('focusInput') focusInput: ElementRef;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngOnInit(): void {
    this.fieldOptions = this.options.map((o) => (this.interchangeOption ? ({ ...o, text: o.value, value: o.text } as Option) : o));
    if (this.file) this.initializeFileUploadOptions();
  }

  initializeFileUploadOptions() {
    this.accept = '.png, .jpg, .jpeg, .gif, .svg';
    this.allowedTypes = this.options.map((u) => `${u.value}`);
  }

  ngAfterViewInit() {
    this.addControls();

    if (this.autoFocus) {
      this.focusInput.nativeElement.focus();
    }
  }

  onChanged(value) {
    this.valueChanges.emit(value);
  }

  get text() {
    return this.type === FieldType.Text;
  }
  
  get email() {
    return this.type === FieldType.Email;
  }

  get textArea() {
    return this.type === FieldType.TextArea;
  }

  get numericDecimal() {
    return this.type === FieldType.NumericDecimal;
  }

  get numericWhole() {
    return this.type === FieldType.NumericWhole;
  }

  get numericCurrency() {
    return this.type === FieldType.NumericCurrency;
  }

  get dropdown() {
    return this.type === FieldType.DropDown;
  }

  get checkbox() {
    return this.type === FieldType.Checkbox;
  }

  get radio() {
    return this.type === FieldType.Radio;
  }

  get dropDownMulti() {
    return this.type === FieldType.DropDownMulti;
  }

  get json() {
    return this.type === FieldType.Json;
  }

  get file() {
    return this.type === FieldType.File;
  }

  get url() {
    return this.type === FieldType.Url;
  }
}
