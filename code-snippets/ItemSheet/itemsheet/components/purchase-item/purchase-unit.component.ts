import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { PurchaseUnit } from '@app/entities';
import { EventService, IdleService } from '@app/shared/services';
import { DealFacade, WorksheetFacade } from '@app/store/deal';
import { BaseWorksheetPageComponent } from '../../base';
import { UnitComponent } from './unit/unit.component';

@Component({
  selector: 'app-purchase-unit',
  templateUrl: './purchase-unit.component.html',
  styleUrls: ['./purchase-unit.component.scss'],
})
export class PurchaseUnitComponent extends BaseWorksheetPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('unitComponent', { static: false }) unitComponent: UnitComponent;

  readonly vm$ = this.worksheetFacade.purchaseUnitsVm$;
  readonly totalTaxAmount$ = this.worksheetFacade.totalTaxAmount$;
  readonly totalTaxableAmount$ = this.worksheetFacade.totalTaxableAmount$;
  readonly unitTaxableAmount$ = this.worksheetFacade.unitTaxableAmount$;
  readonly unitTaxAmount$ = this.worksheetFacade.unitTaxAmount$;

  constructor(
    public override idleService: IdleService,
    public override eventService: EventService,
    public override dealFacade: DealFacade,
    public override worksheetFacade: WorksheetFacade,

  ) {
    super(idleService, eventService, worksheetFacade, dealFacade);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateFormStatus();
    }, 100);
  }

  valuesChanged(unit: PurchaseUnit) {
    const payload = { ...unit, isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updatePurchaseUnitDetails(payload);
  }
  
  resetUnit(id) {
    this.worksheetFacade.resetUnit(id);
  }

  calculateWorksheetDetails() {
    this.worksheetFacade.calculateWorksheetDetails(true);
  }

  taxProfileChanged(taxProfileId: number, id?: number) {
    const payload = { taxProfileId, id, isTaxProfileModified: true, isValid: true, isDirty: true };
    this.worksheetFacade.updateTaxProfileType(payload);
    this.autoSave();
  }

  override isFormValid(): boolean {
    return this.unitComponent.isFormValid();
  }

  override isFormDirty(): boolean {
    return this.unitComponent.isFormDirty();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
