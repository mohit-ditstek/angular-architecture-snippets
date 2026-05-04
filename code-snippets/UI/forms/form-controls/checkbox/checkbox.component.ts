import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { UtilityService } from '@app/shared/services';
import { BaseFormControl } from '../../../forms/base';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends BaseFormControl<boolean> implements AfterViewInit {
  @Input() tabindex = 0;
  @Input() label?: string;
  @Input() name?: string;
  @Input() submitted?: boolean;
  @Input() required?: boolean;
  @Input() disabled = false;
  @Input() disableControl = false;
  @Input() checked?: boolean;
  @Input() showTooltip = true;
  @Input() hideLabel = false;
  @Input() customClass = '';
  @Input() showNote: string;
  @Output() onChanged = new EventEmitter<boolean>();
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(private utilityService: UtilityService, @Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngAfterViewInit(): void {
    this.addControls();
  }
 
  onChange(event) {
    this.onChanged.emit(event.checked);
    this.utilityService.raiseCustomFieldChangeEvent();
  }
  
}
