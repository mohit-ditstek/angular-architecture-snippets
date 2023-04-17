import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from 'src/app/core/models/field-config';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input() config!: FieldConfig;
  @Input() disabled: any;

  group!: FormGroup;
  errorMessage: string = '';
  errorArray: Array<string> = [];
  hide = false;
  constructor() { }
 ngOnInit(){
  debugger
  this.group
 }
  toggleVisibility(): void {
    this.hide = !this.hide;
  }
}
