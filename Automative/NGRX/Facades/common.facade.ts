import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DealType, DMSPushDealRequest, Note, QuickActionRequest, UpdateContactsRequest } from '@app/entities';
import { DealTabPath } from '../../enum';
import { DealLender, DealOverview, DealTabLocks, QuickActionUpdateRequest } from '../../models';
import * as DealActions from '../actions';
import * as DealSelectors from '../selectors';

@Injectable()
export class DealFacade {
  dealLayoutVm$ = this.store.pipe(select(DealSelectors.dealLayoutViewModel));

  dealId$ = this.store.pipe(select(DealSelectors.dealId));
  isDealTypeChanged$ = this.store.pipe(select(DealSelectors.isDealTypeChange));
  currentTab$ = this.store.pipe(select(DealSelectors.currentTab));

  dealOverview$ = this.store.pipe(select(DealSelectors.dealOverview));
  dealDetails$ = this.store.pipe(select(DealSelectors.dealDetails));
  deliveryDate$ = this.store.pipe(select(DealSelectors.deliveryDate));

  currentTabInvalid$ = this.store.pipe(select(DealSelectors.currentTabInvalid));
  currentTabDirty$ = this.store.pipe(select(DealSelectors.currentTabDirty));
  currentTabLock$ = this.store.pipe(select(DealSelectors.currentTabLock));
  isWorksheetLocked$ = this.store.pipe(select(DealSelectors.isWorksheetLocked));
  isContractGenerated$ = this.store.pipe(select(DealSelectors.isContractGenerated));

  dmsImported$ = this.store.pipe(select(DealSelectors.dmsImported));
  isLocked$ = this.store.pipe(select(DealSelectors.isLocked));
  isDealInActive$ = this.store.pipe(select(DealSelectors.isDealInActive));
  isPartAccessoriesLocked$ = this.store.pipe(select(DealSelectors.isPartAccessoriesLocked));
  hasCustomerAddress$ = this.store.pipe(select(DealSelectors.hasCustomerAddress));
  primaryCustomerAddress$ = this.store.pipe(select(DealSelectors.primaryCustomerAddress));
  customerInformation$ = this.store.pipe(select(DealSelectors.customerInformation));

  constructor(private readonly store: Store) {}

  init(dealId: number) {
    this.getDeal(dealId);
  }

  getDeal(dealId: number) {
    this.store.dispatch(DealActions.getDeal({ data: dealId }));
  }

  newDeal() {
    this.store.dispatch(DealActions.newDeal());
  }

  updateContacts(request: UpdateContactsRequest) {
    this.store.dispatch(DealActions.updateContacts({ data: request }));
  }

  updatePrimaryCustomerName(name: string) {
    this.store.dispatch(DealActions.primaryCustomerNameUpdate({ data: name }));
  }

  updatePrimaryUnit(primaryUnit: string) {
    this.store.dispatch(DealActions.primaryUnitUpdate({ data: primaryUnit }));
  }

  updateLenderName(dealLender: DealLender) {
    this.store.dispatch(DealActions.updateLenderName({ data: dealLender }));
  }

  updateTotalDealAmount(totalAmount: number, dealType: DealType) {
    this.store.dispatch(DealActions.totalDealAmountUpdate({ data: { totalAmount, dealType } }));
  }

  dealTab(dealTab: DealTabPath) {
    this.store.dispatch(DealActions.dealTab({ data: dealTab }));
  }

  openPresentDialog(value: boolean) {
    this.store.dispatch(DealActions.openPresentDialog({ data: value }));
  }

  updateDealTabLocks(payload: DealTabLocks) {
    this.store.dispatch(DealActions.updateDealTabLocks({ data: payload }));
  }

  updateDealOverviewDetails(data: DealOverview) {
    this.store.dispatch(DealActions.updateDealOverviewDetails({ data }));
  }

  updateDealTabUnLocks(payload: number) {
    this.store.dispatch(DealActions.updateDealTabUnLocks({ data: payload }));
  }

  getWorksheetDetails(loadDetails = false) {
    if (loadDetails) this.store.dispatch(DealActions.loadWorksheetDetails());
    this.store.dispatch(DealActions.getWorksheetDetails({ data: false }));
  }

  unlockEvent() {
    // Docs List Refresh
    this.store.dispatch(DealActions.getDocs({ data: true }));

    this.store.dispatch(DealActions.unlockEvent({ data: false }));
  }

  reset() {
    this.store.dispatch(DealActions.resetEvent());
  }

  resetTabEvent() {
    this.store.dispatch(DealActions.resetTabEvent());
  }

  lastUpdateDateTimeUpdate() {
    this.store.dispatch(DealActions.lastUpdateDateTimeUpdate());
  }

  createCloneDeal(payload: QuickActionRequest) {
    this.store.dispatch(DealActions.createCloneDeal({ data: payload }));
  }

  deleteDeal(payload: QuickActionRequest) {
    this.store.dispatch(DealActions.deleteDeal({ data: payload }));
  }

  markDeadDeal(payload: QuickActionRequest) {
    this.store.dispatch(DealActions.markDeadDeal({ data: payload }));
  }

  dmsRefresh(dealId: number) {
    this.store.dispatch(DealActions.dmsRefresh({ data: dealId }));
  }

  dmsUpdate(dealId: number) {
    this.store.dispatch(DealActions.dmsUpdate({ data: dealId }));
  }

  closeDeal(payload: QuickActionUpdateRequest) {
    this.store.dispatch(DealActions.closeDeal({ data: payload }));
  }

  blockUnblockDeal(payload: QuickActionRequest) {
    this.store.dispatch(DealActions.blockUnblockDeal({ data: payload }));
  }
  dmsPushDeal(payload: DMSPushDealRequest) {
    this.store.dispatch(DealActions.dmsPushDeal({ data: payload }));
  }

  resetDealType() {
    this.store.dispatch(DealActions.resetDealType());
  }

  setDeliveryDate(date: Date) {
    this.store.dispatch(DealActions.setDeliveryDate({ data: date }));
  }

  // Update docs count
  updateDocsCount(count: number) {
    this.store.dispatch(DealActions.updateDocsCount({ data: count }));
  }

  // get notes count
  setNotesCount(count: number) {
    this.store.dispatch(DealActions.setNotesCount({ data: count }));
  }

  // update notes count
  updateNotesCount() {
    this.store.dispatch(DealActions.updateNotesCount());
  }

  // Update Notes List
  updateNotes() {
    this.store.dispatch(DealActions.getNotes({ data: new Note() }));
  }
  // Update docs List
  updateDocs() {
    this.store.dispatch(DealActions.getDocs({ data: true }));
  }
}
