import { Validators } from '@angular/forms';
import { reg } from '../regex/reg';

export const signUpForm: any = [
  {
    type: 'input',
    fieldType: 'text',
    name: 'firstName',
    value: '',
    placeholder: 'First Name',
    validation: [Validators.required, Validators.pattern(reg.name)],
    isRequired: true,
    class: 'input',
    error: false,
  },
  {
    type: 'input',
    fieldType: 'text',
    name: 'lastName',
    value: '',
    placeholder: 'Last Name',
    validation: [Validators.required, Validators.pattern(reg.name)],
    isRequired: true,
    class: 'input',
    error: false,
  },
  {
    type: 'input',
    fieldType: 'email',
    name: 'email',
    value: '',
    placeholder: 'Email',
    validation: [Validators.required, Validators.pattern(reg.email)],
    isRequired: true,
    hint: true,
    class: 'input',
    error: false,
  },
  {
    type: 'input',
    fieldType: 'password',
    name: 'password',
    value: '',
    placeholder: 'Password',
    validation: [Validators.required, Validators.pattern(reg.password)],
    isRequired: true,
    hint: true,
    class: 'input',
    error: false
  },
  {
    type: 'button',
    name: 'Sign Up',
    class: 'button',
  },
];

