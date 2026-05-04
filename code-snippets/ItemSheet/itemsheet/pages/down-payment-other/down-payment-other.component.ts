import { AfterViewInit, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { EventService, IdleService } from '@app/shared/services';
import { DealFacade,  WorksheetFacade } from '@app/store/deal';
import { BaseWorksheetPageComponent } from '../../base';
import { OtherPaymentFormComponent, TradeInsComponent } from '../../components';
import { Router } from '@angular/router';
import { OtherPayments, TradeInDetails, } from '@app/entities';

@Component({
  selector: 'app-down-payment-other',
  templateUrl: './down-payment-other.component.html',
})
export class DownPaymentOtherComponent extends BaseWorksheetPageComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('formComponent') override childComponents: QueryList<OtherPaymentFormComponent | TradeInsComponent>;
  vm$ = this.worksheetFacade.otherPaymentVm$;
  salesOtherTaxAmount$ = this.worksheetFacade.salesOtherTaxAmount$;
  salesOtherTaxableAmount$ = this.worksheetFacade.salesOtherTaxableAmount$;

  dealOverview$ = this.dealFacade.dealOverview$;

  constructor(
    private router: Router,
    public override eventService: EventService,
    public override idleService: IdleService,
    public override worksheetFacade: WorksheetFacade,
    public override dealFacade: DealFacade
  ) {
    super(idleService, eventService, worksheetFacade, dealFacade);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateFormStatus(), 100);
  }

  valueChanged(payments: OtherPayments) {
    const payload = { ...payments, isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updateOtherPayments(payload);
  }

  calculateWorksheetDetails() {
    this.worksheetFacade.calculateWorksheetDetails(true);
  }

  tradeInsValuesChanged(tradeIn: TradeInDetails) {
    const payload = { ...tradeIn, isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updateTradeInDetails(payload);
  }

  tradeInsTrackBy(_index: number, tradeIn: TradeInDetails) {
    return tradeIn.id;
  }

  addTradeIn() {
    const url = this.router.url.replace('worksheet/down-payments', 'customers/trade-in');
    this.router.navigateByUrl(url);
  }

  reset() {
    this.worksheetFacade.resetWorksheetChanges();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
