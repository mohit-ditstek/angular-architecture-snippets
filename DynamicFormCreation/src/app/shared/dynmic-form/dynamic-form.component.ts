import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../core/models/field-config';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  exportAs: 'dynamicForm',
})
export class DynamicFormComponent implements OnInit {
  @Input()
  config: FieldConfig[] = [];
  form: FormGroup;
  field: any;
  @Output() submitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(this.config);
  }

  ngOnInit(): void {
    this.form = this.createGroup();
  }

  createGroup(): any {
    const group = this.fb.group({});
    this.config.forEach(control => group.addControl(control.name, this.fb.control(control.value, control.validation)));
    return group;
  }
}
