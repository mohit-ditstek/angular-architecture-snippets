import { AfterViewInit, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { EventService, IdleService, UtilityService } from '@app/shared/services';
import { DealFacade, WorksheetFacade } from '@app/store/deal';
import { BaseWorksheetPageComponent } from '../../base';
import { FinanceTermFormComponent } from '../../components';
import { DealType, FeatureFlag, FinanceTerm } from '@app/entities';
import { Router } from '@angular/router';
import { FeatureFlagsService } from '@app/base';

@Component({
  selector: 'app-finance-terms',
  templateUrl: './finance-terms.component.html',
})
export class FinanceTermsComponent extends BaseWorksheetPageComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('financeTermFormComponent') override childComponents: QueryList<FinanceTermFormComponent>;
  vm$ = this.worksheetFacade.financeTermVm$;
  isFinanceReservedAmountEnabled: boolean;

  constructor(
    public override eventService: EventService,
    public override idleService: IdleService,
    public utilityService: UtilityService,
    public override worksheetFacade: WorksheetFacade,
    public override dealFacade: DealFacade,
    public route: Router,
    private featureFlagsService: FeatureFlagsService

  ) {
    super(idleService, eventService, worksheetFacade, dealFacade);
    this.isFinanceReservedAmountEnabled = this.featureFlagsService.isFeatureEnabled(FeatureFlag.FinanceReservedAmountEnabled);

  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateFormStatus(), 100);
  }

  valueChanged(data: FinanceTerm) {
    this.worksheetFacade.updateFinanceTerms({ ...data });
  }

  disableAutoSave(event: boolean){
    this.autoSaveDisable = event;
  }
  
  dealTypeChanged(dealType) {
    const payload = { dealType, isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updateDealType(payload);
    if (dealType === DealType.Cash) this.route.navigateByUrl(this.route.url.replace('terms', `units`));
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
