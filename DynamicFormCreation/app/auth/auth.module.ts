import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from '../shared/dynmic-form/dynamic-form.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';


@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    DynamicFormModule
  ]
})
export class AuthModule { }
