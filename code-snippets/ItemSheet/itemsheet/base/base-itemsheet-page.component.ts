import { QueryList } from '@angular/core';
import { BaseAutoSaveComponent, BaseFormComponent } from '@app/base';
import { EventService, IdleService } from '@app/shared/services';
import { DealFacade, WorksheetFacade } from '@app/store/deal';

export abstract class BaseWorksheetPageComponent extends BaseAutoSaveComponent {
  childComponents: QueryList<BaseFormComponent>;
  disabled$ = this.dealFacade.currentTabLock$;
  hasCustomerAddress$ = this.dealFacade.hasCustomerAddress$;
  primaryCustomerAddress$ = this.dealFacade.primaryCustomerAddress$;
  isContractGenerated$ = this.dealFacade.isContractGenerated$;
  isDisabled = false;
  skipDisabledCheck = false;

  constructor(
    public override idleService: IdleService,
    public override eventService: EventService,
    public worksheetFacade: WorksheetFacade,
    public dealFacade: DealFacade
  ) {
    super(idleService, eventService);

    // TODO: Need to check other way
    this.subscription.add(this.disabled$.subscribe((disable) => (this.isDisabled = disable)));
  }

  public override handleErrorEvent(): void {
    if (this.childComponents?.length > 0) {
      this.childComponents.toArray().some((c) => c.form.form.markAllAsTouched());
    }
  }

  updateFormStatus() {
    const payload = { isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updateFormStatus(payload);
  }

  autoSave(): void {
    this.worksheetFacade.calculateWorksheetDetails(true);
  }

  override isFormValid(): boolean {
    return !this.skipDisabledCheck && this.isDisabled ? true : this.childComponents?.toArray().every((c) => c.isFormValid());
  }

  override isFormDirty(): boolean {
    return this.childComponents?.some((c) => c.isFormDirty());
  }

  override destroy(): void {
    const isDirty = this.isFormDirty(),
      isValid = this.isFormValid();
    if (isDirty && isValid) this.autoSave();

    this.dealFacade.resetTabEvent();
    this.subscription.unsubscribe();
  }
}
