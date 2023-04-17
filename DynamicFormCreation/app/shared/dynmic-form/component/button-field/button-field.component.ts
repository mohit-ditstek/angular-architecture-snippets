import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/core/models/field-config';

@Component({
  selector: 'app-button-field',
  templateUrl: './button-field.component.html',
  styleUrls: ['./button-field.component.scss'],
})
export class ButtonFieldComponent {
  @Input() config!: FieldConfig;
  group!: FormGroup;
  @Output() btnClickEvent = new EventEmitter<string>();
  constructor() {}

  onButtonClicked(): void {
    this.btnClickEvent.emit('Click');
  }

}
