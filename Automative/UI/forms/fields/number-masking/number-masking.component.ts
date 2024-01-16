import { AfterViewInit, Component, forwardRef, Input, OnInit, Optional, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { BaseMaskingComponent } from '@app/base';
import { EventService } from '@app/shared/services';

@Component({
  selector: 'app-number-masking',
  templateUrl: './number-masking.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberMaskingComponent),
      multi: true,
    },
  ],
})
export class NumberMaskingComponent extends BaseMaskingComponent implements OnInit, AfterViewInit {
  @ViewChild('controlName') inputControl: NgModel;

  @Input() maskedValue = true;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder = '';
  @Input() required?: boolean;
  @Input() submitted?: boolean;
  @Input() disabled?: boolean;
  @Input() readonly?: boolean;
  @Input() showNote?: string;
  @Input() maxlength?: number = 11;
  @Input() minlength?: number = 5;
  @Input() tabindex: number;
  @Input() showOnFocus = false;
  @Input() override showMasked = true;

  override dynamicMasking = true;

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  pattern = {
    X: {
      pattern: /[a-zA-Z0-9-]/,
      symbol: '*',
    },
    Y: {
      pattern: /[a-zA-Z0-9-]/,
    },
  };

  override defaultMaskedFormat = 'X{25}';
  override partialMaskedFormat = 'X{25}';
  override unmaskedFormat = 'Y{25}';

  constructor(public override eventService: EventService, @Optional() public override ngForm: NgForm) {
    super(eventService, ngForm);
  }

  ngOnInit(): void {
    this.setHiddentInput();
  }

  ngAfterViewInit() {
    this.addControls();
    this.initMasking();
  }

  setHiddentInput() {
    this.hiddenInput = !!this.showMasked;
  }

  focusOut() {
    if (this.showOnFocus) {
      this.maskedFormat = this.defaultMaskedFormat;
      this.hiddenInput = true;
    }
  }

  focusIn() {
    if (this.showOnFocus) this.hiddenInput = false;
  }

  handleChange(value) {
    this.value = value?.toUpperCase();
    this.inputUpdate.next(value);
  }
}
