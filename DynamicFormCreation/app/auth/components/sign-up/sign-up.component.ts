import { Component, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { signUpForm } from 'src/app/core/config/form.constant';
import { FieldConfig } from 'src/app/core/models/field-config';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  @ViewChild('form') form: any;
  config: FieldConfig[] = signUpForm;

  constructor(private router: Router) { }

  signUp(): void {
    if (this.form.form.invalid) {
      this.form.form.markAllAsTouched();
    } else {
      console.log(this.form);
      // here is the logic for sign in user.
    }
  }

}
