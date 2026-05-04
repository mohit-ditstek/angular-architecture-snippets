import { EventService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from './base-form.component';

export abstract class BaseDetailsComponent {
  public subscription = new Subscription();
  abstract form: BaseFormComponent;

  constructor(public eventService: EventService) {
    // Pristine form after api call completions.
    this.subscription.add(
      this.eventService.backgroundCallCompletedObservable$.subscribe((success) => {
        if (success) {
          this.eventService.formPristineObservable.next();
          if (this.form) this.form.markAsPristine();
        }
      })
    );
  }

  public isFormValid() {
    return this.form?.isFormValid();
  }

  public isFormDirty() {
    return this.form?.isFormDirty();
  }

  public markAsDirty() {
    this.form?.markAsDirty();
  }

  public markAsTouched() {
    this.form?.markAsTouched();
  }

  destroy(): void {
    this.subscription.unsubscribe();
  }
}
