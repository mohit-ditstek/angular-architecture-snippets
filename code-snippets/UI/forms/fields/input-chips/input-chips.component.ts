import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, Output, QueryList, ViewChild, ViewChildren, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { InputFieldType } from '@app/entities';
import { AppFacade } from '@app/store/app';
import { BaseFieldControl } from '../../base';

@Component({
  selector: 'app-input-chips',
  templateUrl: './input-chips.component.html',
  styleUrls: ['./input-chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputChipsComponent),
      multi: true,
    },
  ],
})
export class InputChipsComponent extends BaseFieldControl<string> implements AfterViewInit{
  
  override inputFieldType = InputFieldType.IndividualNames;
  override name: string;
  @Input() placeholder: string;
  @Input() label: string;
  @Input() blur = true;
  @Input() maxlength = 50;
  @Input() autoFocus = false;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string[]>();

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = inject(LiveAnnouncer);


  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  @ViewChild('focusInput') focusInput: ElementRef;

  constructor(@Optional() public override ngForm: NgForm, override appFacade: AppFacade) {
    super(ngForm, appFacade);
  }

  ngAfterViewInit() {
    this.addControls();
    if (this.autoFocus) {
      this.focusInput.nativeElement.focus();
    }
  }

  add(event: MatChipInputEvent) {
    const value = this.titleCase((event.value || '').trim());
    if (value) {
      const data = [...this.value];
      data.push(value)
      this.valueChange.emit(data);
    }
    event.chipInput!.clear();
  }

  remove(value: string): void {
    const index = this.value.indexOf(value);
    const data = [...this.value];
    data.splice(index, 1);
    this.valueChange.emit(data);
  }

  edit(data: string, event: MatChipEditedEvent) {
    const value = this.titleCase(event.value.trim());
    const details = [...this.value];
    if (!value) {
      this.remove(data);
      return;
    }
    // Edit existing Value
    const index = details.indexOf(data);
    if (index >= 0) {
      details[index] = value;
      this.valueChange.emit(details);
    }
  }

  titleCase(value: string){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}