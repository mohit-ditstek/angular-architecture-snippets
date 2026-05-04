import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Option } from '@app/entities';
import { BaseFormControl } from '../../base';
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
})
export class MultiSelectComponent extends BaseFormControl<string> implements AfterViewInit {

  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() showAllSelectOption = true;
  @Input() disableControl = false;
  @Input() withWidth = false;
  @Input() required = false;
  @Input() submitted = false;
  @Input() options: Option[] = [];
  @Input() selectionText: string;
  
  @Output() selection = new EventEmitter<string[]>();

  @ViewChild('select') select: MatSelect;
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngAfterViewInit(): void {
    this.addControls();
  }

  toggleAllSelection(event) {
    if (event.checked) {
      this.select.options.forEach((item) => item.select());
    } else {
      this.select.options.forEach((item) => item.deselect());
    }
  }

  selectionChange(event) {
    if (!event) return;

    const filteredValue = event.value.filter(v => v);
    this.value = filteredValue;
    this.selection.emit(filteredValue);
  }

  get firstOption() {
    if (this.value.length == 1) {
      return this.options.find(o => o.value === this.value[0]);
    }
    return null;
  }

  get panelClass() {
    return this.withWidth ? 'multiSelectionWidth' : 'multiSelection';
  }
}
