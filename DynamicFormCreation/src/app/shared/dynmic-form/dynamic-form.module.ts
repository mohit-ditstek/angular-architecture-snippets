import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormDirective } from '../../core/directive/dynamic-form.directive';
import { InputFieldComponent } from './component/input-field/input-field.component';
import { TextareaComponent } from './component/textarea/textarea.component';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFormDirective,
    InputFieldComponent,
    TextareaComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [DynamicFormComponent, InputFieldComponent]
})
export class DynamicFormModule { }
