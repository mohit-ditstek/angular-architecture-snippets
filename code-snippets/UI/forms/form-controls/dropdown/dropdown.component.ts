import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { TooltipPosition } from '@angular/material/tooltip';
import { Option } from '@app/entities';
import { UtilityService } from '@app/shared/services';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent extends BaseFormControl<string> implements AfterViewInit {
  @Input() label?: string;
  @Input() name: string;
  @Input() errorMessage?: string;
  @Input() placeholder?: string;
  @Input() class?: string;
  @Input() required?: boolean;
  @Input() disableControl = false;
  @Input() submitted?: boolean;
  @Input() options: Option[] = [];
  @Input() simpleSelect = false;
  @Input() showDefaultOption = false;
  @Input() tabindex = 0;
  @Input() autoFocus = false;
  @Input() hideEllipsis = false;
  @Input() tooltipPosition: TooltipPosition = 'right';

  @Output() selectedValue = new EventEmitter<number>();

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  @ViewChild('selectInput', { static: false }) matSelect: MatSelect;

  constructor(@Optional() public override ngForm: NgForm, private utilityService: UtilityService) {
    super(ngForm);
  }

  ngAfterViewInit() {
    this.addControls();
  }

  selectionChange(event) {
    this.selectedValue.emit(event.value != undefined ? event.value : null);
    this.utilityService.raiseCustomFieldChangeEvent();
  }
}
