import { Injectable, OnDestroy, Optional, QueryList } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ConfigItemType, InputFieldType } from '@app/entities';
import { AppFacade } from '@app/store/app';
import { Subscription } from 'rxjs';
import { BaseValueAccessor } from './base-value-accessor';

@Injectable()
export abstract class BaseAutoComplete<T> extends BaseValueAccessor<T> implements OnDestroy {
  subscription: Subscription = new Subscription();
  configItemType = ConfigItemType.FieldValidationRegex;
  abstract inputFieldType: InputFieldType;
  pattern: string;

  public ngModels: QueryList<NgModel>;

  constructor(@Optional() public ngForm: NgForm, public appFacade: AppFacade) {
    super();
  }

  init(): void {
    this.subscription.add(
      this.appFacade.configItems$.subscribe((res) => {
        if (res && res.length > 0) {
          const fieldValidationRegex = res.filter((t) => t.type == this.configItemType);
          if (fieldValidationRegex) {
            this.pattern = fieldValidationRegex.find((f) => f.name == this.inputFieldType).value.toString();
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
