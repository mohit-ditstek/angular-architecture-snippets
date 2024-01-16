import { Injectable, Optional, QueryList } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { BaseValueAccessor } from './base-value-accessor';


@Injectable()
export class BaseFormControl<T> extends BaseValueAccessor<T> {
  public ngModels: QueryList<NgModel>;

  constructor(@Optional() public ngForm: NgForm) {
    super();
  }

  addControls() {
    if (this.ngForm) {
      this.ngModels.forEach(model => this.ngForm.addControl(model));
    }
  }

  removeControls() {
    if (this.ngForm) {
      this.ngModels.forEach(model => this.ngForm.removeControl(model));
    }
  }
}