/**
 * SHARED UI COMPONENTS - Custom Input & Form Controls
 * 
 * Base value accessor and form control for building reusable form components.
 * Integrates with Angular's ControlValueAccessor for easy form binding.
 * Supports material design and custom validation.
 */

import { ControlValueAccessor, NgForm } from '@angular/forms';

// ============================================
// BASE VALUE ACCESSOR - ControlValueAccessor Implementation
// ============================================

/**
 * Generic base class for custom form controls
 * Implements ControlValueAccessor for two-way binding with reactive forms
 * 
 * Features:
 * - Generic type support
 * - Built-in change/touch tracking
 * - Works with both template and reactive forms
 */
export class BaseValueAccessor<T> implements ControlValueAccessor {
  /**
   * Internal value storage
   */
  private innerValue: T;

  /**
   * Callbacks for change detection
   */
  private changed = new Array<(value: T) => void>();

  /**
   * Callbacks for touch detection
   */
  private touched = new Array<() => void>();

  /**
   * Get the current value
   */
  get value(): T {
    return this.innerValue;
  }

  /**
   * Set value and notify listeners
   */
  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      // Notify all registered change callbacks
      this.changed.forEach((f) => f(value));
    }
  }

  /**
   * Mark control as touched and notify listeners
   */
  touch(): void {
    this.touched.forEach((f) => f());
  }

  /**
   * Called by Angular forms when writing value to control
   * @param value The value to write
   */
  writeValue(value: T): void {
    this.innerValue = value;
  }

  /**
   * Called by Angular forms to register change callback
   * @param fn Function to call on value change
   */
  registerOnChange(fn: (value: T) => void): void {
    this.changed.push(fn);
  }

  /**
   * Called by Angular forms to register touch callback
   * @param fn Function to call on touch
   */
  registerOnTouched(fn: () => void): void {
    this.touched.push(fn);
  }
}

// ============================================
// BASE FORM CONTROL - Extended with Validation
// ============================================

/**
 * Extended base class with form validation support
 * Adds NgModel tracking and error handling
 * 
 * Usage:
 * export class CustomInput extends BaseFormControl<string> {
 *   constructor(@Optional() public override ngForm: NgForm) {
 *     super(ngForm);
 *   }
 * }
 */
export class BaseFormControl<T> extends BaseValueAccessor<T> {
  /**
   * Reference to the NgForm (optional)
   */
  ngForm?: NgForm;

  /**
   * List of NgModel references for validation
   */
  ngModels: any[] = [];

  /**
   * Whether field shows validation errors
   */
  showError = false;

  constructor(ngForm?: NgForm) {
    super();
    this.ngForm = ngForm;
  }

  /**
   * Add NgModel controls to internal tracking
   */
  addControls(): void {
    if (this.ngModels && this.ngModels.length > 0) {
      this.ngModels.forEach((item) => {
        if (this.ngForm) {
          this.ngForm.addControl(item);
        }
      });
    }
  }

  /**
   * Get error for specific field
   */
  getFieldError(fieldName: string): string | null {
    const control = this.ngForm?.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return null;
    }

    // Map common validation errors
    if (control.errors['required']) {
      return `${fieldName} is required`;
    }

    if (control.errors['email']) {
      return 'Invalid email format';
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }

    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }

    if (control.errors['pattern']) {
      return 'Invalid format';
    }

    return null;
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string): boolean {
    const control = this.ngForm?.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Mark all controls as touched to show validation errors
   */
  markAllAsTouched(): void {
    this.ngForm?.controls;
    Object.keys(this.ngForm?.controls || {}).forEach((key) => {
      this.ngForm?.get(key)?.markAsTouched();
    });
  }
}

// ============================================
// EXAMPLE: EMAIL INPUT COMPONENT
// ============================================

/*
import { Component, Input, forwardRef, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-group">
      <label *ngIf="label">{{ label }}</label>
      <input
        [ngModel]="value"
        (ngModelChange)="value = $event"
        (blur)="touch()"
        type="email"
        [placeholder]="placeholder"
        [pattern]="emailPattern"
        required
        class="input-field"
      />
      <span *ngIf="hasError('email')" class="error-text">
        {{ getFieldError('email') }}
      </span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailInputComponent),
      multi: true,
    },
  ],
})
export class EmailInputComponent extends BaseFormControl<string> {
  @Input() label: string;
  @Input() placeholder: string = 'Enter email';

  emailPattern = '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$';

  constructor(@Optional() public override ngForm: NgForm) {
    super(ngForm);
  }
}
*/

// ============================================
// COMMON INPUT COMPONENTS
// ============================================

/*
Available shared input components:
- EmailInputComponent: Validates email format
- PasswordInputComponent: Password field with show/hide
- PhoneNumberComponent: Phone input with formatting
- DropdownComponent: Select with Material integration
- TextAreaComponent: Multi-line text input
- NumberInputComponent: Numeric input with step controls
- FileUploadComponent: File selection with preview
- DatePickerComponent: Date selection with calendar

All extend BaseFormControl<T> and support:
✅ Template forms (ngForm, ngModel)
✅ Reactive forms (formControl, formGroup)
✅ Validation error display
✅ i18n support (translations)
✅ Material Design
✅ Custom styling
*/

// ============================================
// USAGE IN TEMPLATE FORMS
// ============================================

/*
<form #form="ngForm" (ngSubmit)="onSubmit()">
  <app-email-input
    [(ngModel)]="email"
    name="email"
    label="Email Address"
    placeholder="user@example.com"
    required
  ></app-email-input>

  <app-password-input
    [(ngModel)]="password"
    name="password"
    label="Password"
    required
  ></app-password-input>

  <app-dropdown
    [(ngModel)]="selectedOption"
    name="category"
    label="Category"
    [options]="categoryOptions"
  ></app-dropdown>

  <button type="submit" [disabled]="form.invalid">
    Submit
  </button>
</form>
*/

// ============================================
// USAGE IN REACTIVE FORMS
// ============================================

/*
export class MyComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      category: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data = this.form.value;
      // Submit data
    }
  }
}

Template:
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <app-email-input
    formControlName="email"
    label="Email"
  ></app-email-input>

  <div *ngIf="form.get('email')?.errors && form.get('email')?.touched">
    <span *ngIf="form.get('email')?.errors?.['required']">
      Email is required
    </span>
    <span *ngIf="form.get('email')?.errors?.['email']">
      Invalid email format
    </span>
  </div>

  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Extend BaseFormControl for consistency
  - Implement NG_VALUE_ACCESSOR for form integration
  - Use generics for type safety
  - Provide proper error messages
  - Support both template and reactive forms
  - Validate on-the-fly and on-blur
  - Mark as touched when appropriate
  - Support disabled state

❌ DON'T:
  - Bypass ControlValueAccessor
  - Mix form types (template + reactive)
  - Forget to register in providers
  - Over-validate (validate on each keystroke)
  - Hard-code error messages (use i18n)
  - Forget to handle null/undefined values
*/
