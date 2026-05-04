import { NgForm } from '@angular/forms';
import { CustomerType } from '@app/entities';
import { EventService, RxjsService } from '@app/shared/services';
import { Subscription } from 'rxjs';

export abstract class BaseFormComponent {
  abstract form: NgForm;

  public customerType = CustomerType.Individual;

  subscription = new Subscription();

  constructor(public eventService: EventService, public rxjsService: RxjsService) {
    this.subscription.add(
      this.eventService.formPristineObservable$.subscribe(() => {
        this.form?.form?.markAsUntouched();
        this.form?.form?.markAsPristine();
      })
    );

    this.subscription.add(
      this.eventService.formMarkAsDirtyObservable$.subscribe((markDirty) => {
        if (markDirty) {
          this.form?.form?.markAsDirty();
        }
      })
    );

    this.subscription.add(
      this.eventService.formErrorsObservable$.subscribe((markDirty) => {
        this.form?.form.markAllAsTouched();

        // Note: If we will execute everytime then it will enable the save button on deals
        if (markDirty) {
          this.form?.form.markAsDirty();
        }

        this.eventService.scrollToRequiredField();
      })
    );
  }

  registerFormValueChange(timoutsSeconds = 1000) {
    this.subscription.add(
      this.rxjsService.debounceWithUntilChange(this.form.valueChanges, timoutsSeconds).subscribe(() => {
        if (this.form.dirty) {
          this.formValuesChanged();
        }
      })
    );
  }

  public formValuesChanged() {
    // Need to override by child
  }

  public isFormValid() {
    return this.form?.valid;
  }

  public isFormDirty() {
    return this.form?.dirty;
  }

  public markAsDirty() {
    this.form?.form.markAsDirty();
  }

  public markAsPristine() {
    this.form?.form.markAsPristine();
  }

  public markAsTouched() {
    this.form?.form.markAllAsTouched();
  }

  get isIndividualType() {
    return this.customerType == CustomerType.Individual;
  }

  get isBusinessType() {
    return this.customerType == CustomerType.Business;
  }

  get isJointType() {
    return this.customerType == CustomerType.Joint;
  }

  get isMobile() {
    return window.innerWidth < 768;
  }

  public fieldName(name: string, type?: string) {
    return `${type}${name}`;
  }

  destroy(): void {
    this.subscription.unsubscribe();
  }
}
