import { Component, EventEmitter, Input, OnInit, Optional, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { TooltipPosition } from '@angular/material/tooltip';
import { Option } from '@app/entities';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-years-dropdown',
  templateUrl: './years-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearsDropdownComponent),
      multi: true,
    },
  ],
})
export class YearsDropdownComponent extends BaseFormControl<string> implements OnInit {
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
  @Input() showDefaultOption? = false;
  @Input() tabindex = 0;
  @Input() autoFocus = false;
  @Input() hideEllipsis = false;
  @Input() includeFuture = true;
  @Input() tooltipPosition: TooltipPosition = 'right';

  @Output() selectedValue = new EventEmitter<number>();

  @ViewChild('selectInput', { static: false }) matSelect: MatSelect;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  public readonly currentYear = new Date().getFullYear();

  ngOnInit() {
    this.getYearDropdownOptions();
  }

  selectionChange(event) {
    this.selectedValue.emit(event.value != undefined ? event.value : null);
  }

  getYearDropdownOptions() {
    const lastYear = this.currentYear - 20;
    const yearOptions: Option[] = [];
    const startYear = this.includeFuture ? this.currentYear + 1 : this.currentYear;
    for (let year = startYear; year >= lastYear; year--) {
      yearOptions.push({
        text: year.toString(),
        value: year,
        isDisabled: false,
      });
    }
    this.options = yearOptions;
  }
}
