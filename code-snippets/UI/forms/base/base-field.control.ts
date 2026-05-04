import { Injectable, OnDestroy, Optional, QueryList } from '@angular/core';
import { NgForm, NgModel, Validators } from '@angular/forms';
import { ConfigItemType, InputFieldType } from '@app/entities';
import { AppFacade } from '@app/store/app';
import { Subscription, delay } from 'rxjs';
import { BaseValueAccessor } from './base-value-accessor';

@Injectable()
export abstract class BaseFieldControl<T> extends BaseValueAccessor<T> implements OnDestroy {
  public subscription = new Subscription();
  public configItemType = ConfigItemType.FieldValidationRegex;

  abstract inputFieldType: InputFieldType;
  abstract name: string;
  public ngModels: QueryList<NgModel>;

  constructor(@Optional() public ngForm: NgForm, public appFacade: AppFacade) {
    super();
  }

  init(): void {
    this.subscription.add(
      this.appFacade.configItems$.pipe(delay(100)).subscribe((res) => {
        if (res && res.length > 0) {
          const fieldValidationRegex = res.filter((t) => t.type == this.configItemType);
          if (fieldValidationRegex) {
            const pattern = fieldValidationRegex.find((f) => f.name == this.inputFieldType).value.toString();

            this.ngForm.controls[this.name].addValidators([Validators.pattern(pattern)]);
            this.ngForm.controls[this.name].updateValueAndValidity();
          }
        }
      })
    );
  }

  addControls() {
    if (this.ngForm) {
      this.ngModels.forEach((model) => this.ngForm.addControl(model));
    }
  }

  removeControls() {
    if (this.ngForm) {
      this.ngModels.forEach((model) => this.ngForm.removeControl(model));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
