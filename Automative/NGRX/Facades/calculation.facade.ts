import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ComponentTax,
  DealTypeChange,
  FinanceTerm,
  FormStatus,
  OtherPayments,
  PurchaseUnit,
  TaxProfileChange,
  TradeInDetails,
  WorksheetDetails,
  WorksheetTab,
} from '@app/entities';

import * as WorksheetActions from '../actions/worksheet.actions';
import * as WorksheetSelectors from '../selectors';

@Injectable()
export class WorksheetFacade {
  showRatingDialog$ = this.store.pipe(select(WorksheetSelectors.showRatingDialog));
  currentTab$ = this.store.pipe(select(WorksheetSelectors.currentTab));
  worksheetVm$ = this.store.pipe(select(WorksheetSelectors.worksheetViewModel));
  purchaseUnitsVm$ = this.store.pipe(select(WorksheetSelectors.purchaseUnitsViewModel));
  otherPaymentVm$ = this.store.pipe(select(WorksheetSelectors.otherPaymentViewModel));
  financeTermVm$ = this.store.pipe(select(WorksheetSelectors.financeTermViewModel));
  workSheetDetails$ = this.store.pipe(select(WorksheetSelectors.workSheetDetails));
  paymentTerm$ = this.store.pipe(select(WorksheetSelectors.paymentTerm));
  dealerCostToggle$ = this.store.pipe(select(WorksheetSelectors.dealerCostToggle));
  purchasedUnits$ = this.store.pipe(select(WorksheetSelectors.purchasedUnits));
  isDealTypeChanged$ = this.store.pipe(select(WorksheetSelectors.isDealTypeChanged));

  totalTaxAmount$ = this.store.pipe(select(WorksheetSelectors.totalTaxAmount));
  totalTaxableAmount$ = this.store.pipe(select(WorksheetSelectors.totalTaxableAmount));
  unitTaxableAmount$ = this.store.pipe(select(WorksheetSelectors.unitTaxableAmount));
  unitTaxAmount$ = this.store.pipe(select(WorksheetSelectors.unitTaxAmount));
  activeUnitIndex$ = this.store.pipe(select(WorksheetSelectors.activeUnitIndex));

  salesOtherTaxAmount$ = this.store.pipe(select(WorksheetSelectors.salesOtherTaxAmount));
  salesOtherTaxableAmount$ = this.store.pipe(select(WorksheetSelectors.salesOtherTaxableAmount));

  protectionProductTaxAmount$ = this.store.pipe(select(WorksheetSelectors.protectionProductTaxAmount));
  protectionProductTaxableAmount$ = this.store.pipe(select(WorksheetSelectors.protectionProductTaxableAmount));
  hasCustomerJurisdictionType$ = this.store.pipe(select(WorksheetSelectors.hasCustomerJurisdictionType));

  constructor(private readonly store: Store) {}

  getWorksheetDetails(openRatingDialog = false) {
    this.store.dispatch(WorksheetActions.getWorksheetDetails({ data: openRatingDialog }));
  }

  getWorksheetDetailsSuccess(worksheet: WorksheetDetails) {
    this.store.dispatch(WorksheetActions.getWorksheetDetailsSuccess({ data: worksheet }));
  }

  updateFormStatus(payload: FormStatus) {
    this.store.dispatch(WorksheetActions.updateFormStatus({ data: payload }));
  }

  updatePurchaseUnitDetails(payload: PurchaseUnit) {
    this.store.dispatch(WorksheetActions.updatePurchaseUnitDetails({ data: payload }));
  }

  updateTradeInDetails(payload: TradeInDetails) {
    this.store.dispatch(WorksheetActions.updateTradeInDetails({ data: payload }));
  }

  updateFinanceTerms(payload: FinanceTerm) {
    this.store.dispatch(WorksheetActions.updateFinanceTerms({ data: payload }));
  }

  updateOtherPayments(payload: OtherPayments) {
    this.store.dispatch(WorksheetActions.updateOtherPayments({ data: payload }));
  }

  calculateWorksheetDetails(save: boolean) {
    this.store.dispatch(WorksheetActions.calculateWorksheetDetails({ data: save }));
  }

  resetWorksheetChanges() {
    this.store.dispatch(WorksheetActions.resetWorksheetChanges());
  }

  setActiveProductId(id: number) {
    this.store.dispatch(WorksheetActions.setActiveProductId({ data: id }));
  }

  updateTaxDetails(payload: PurchaseUnit) {
    this.store.dispatch(WorksheetActions.updateTaxDetails({ data: payload }));
  }

  salesOtherTaxes(payload: ComponentTax) {
    this.store.dispatch(WorksheetActions.salesOtherTaxes({ data: payload }));
  }

  updateProtectionProducts(payload) {
    this.store.dispatch(WorksheetActions.updateProtectionProducts({ data: payload }));
  }

  updateProductSelectionToggle() {
    this.store.dispatch(WorksheetActions.updateProductSelectionToggle());
  }

  worksheetTab(tab: WorksheetTab) {
    this.store.dispatch(WorksheetActions.worksheetTab({ data: tab }));
  }

  showRateProduct(present = false) {
    this.store.dispatch(WorksheetActions.showRateProduct({ data: present }));
  }

  hideRateProduct(present = false) {
    this.store.dispatch(WorksheetActions.hideRateProduct({ data: present }));
  }

  resetRatingProducts(isRePresent = false) {
    this.store.dispatch(WorksheetActions.resetRatingProducts({ data: isRePresent }));
  }

  resetRatingProductsSuccess(rePresent = false) {
    this.store.dispatch(WorksheetActions.resetRatingProductsSuccess({ data: rePresent }));
  }

  updateTabLocks() {
    this.store.dispatch(WorksheetActions.updateTabLocks());
  }

  updateDeliveryDate(date: Date) {
    this.store.dispatch(WorksheetActions.updateDeliveryDate({ data: date }));
  }

  updateDealType(payload: DealTypeChange) {
    this.store.dispatch(WorksheetActions.updateDealType({ data: payload }));
  }

  dealerCostToggle(toggle: boolean) {
    this.store.dispatch(WorksheetActions.dealerCostToggle({ data: toggle }));
  }

  getActiveUnit() {
    this.store.dispatch(WorksheetActions.getActiveUnit());
  }

  updateTaxProfileType(payload: TaxProfileChange) {
    this.store.dispatch(WorksheetActions.updateTaxProfileType({ data: payload }));
  }

  resetUnit(id: number) {
    this.store.dispatch(WorksheetActions.resetUnit({ data: id }));
  }
}
