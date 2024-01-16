import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CustomerTab, CustomerType } from '@app/entities';
import { CustomerDetails, CustomerDetailsRequest } from '../../models';
import * as CustomerActions from '../actions';
import * as CustomerSelectors from '../selectors';

@Injectable()
export class CustomerFacade {
  loaded$ = this.store.pipe(select(CustomerSelectors.loaded));

  customer$ = this.store.pipe(select(CustomerSelectors.customerSelector));
  currentTab$ = this.store.pipe(select(CustomerSelectors.currentCustomerTab));

  customerType$ = this.store.pipe(select(CustomerSelectors.customerType));
  primaryCustomerName$ = this.store.pipe(select(CustomerSelectors.primaryCustomerName));
  secondaryCustomerName$ = this.store.pipe(select(CustomerSelectors.secondaryCustomerName));
  primaryCustomer$ = this.store.pipe(select(CustomerSelectors.primaryCustomer));
  relationship$ = this.store.pipe(select(CustomerSelectors.relationship));

  customerLayoutViewModel$ = this.store.pipe(select(CustomerSelectors.customerLayoutViewModel));
  customerOverviewViewModel$ = this.store.pipe(select(CustomerSelectors.customerOverviewViewModel));
  customerDetailViewModel$ = this.store.pipe(select(CustomerSelectors.customerDetailViewModel));

  addressViewModel$ = this.store.pipe(select(CustomerSelectors.addressViewModel));
  insuranceViewModel$ = this.store.pipe(select(CustomerSelectors.insuranceViewModel));
  isValid$ = this.store.pipe(select(CustomerSelectors.isCustomerValid));
  validAddressTab$ = this.store.pipe(select(CustomerSelectors.validAddressTab));
  customerSummary$ = this.store.pipe(select(CustomerSelectors.customerSummaryDetailViewModel));
  printCustomerViewModel$ = this.store.pipe(select(CustomerSelectors.printCustomerViewModel));
  
  constructor(private readonly store: Store) {}

  getCustomersSuccess(payload: CustomerDetails) {
    this.store.dispatch(CustomerActions.getCustomersSuccess({ data: payload }));
  }

  getCustomerDetails(data: CustomerDetailsRequest) {
    this.store.dispatch(CustomerActions.getCustomerDetails({ data: data }));
  }
  
  getDMSCustomerDetails(data: CustomerDetailsRequest) {
    this.store.dispatch(CustomerActions.getDMSCustomerDetails({ data: data }));
  }

  saveCustomer() {
    this.store.dispatch(CustomerActions.saveCustomers());
  }

  changeCustomerType(customerType: CustomerType) {
    this.store.dispatch(CustomerActions.changeCustomerType({ data: customerType }));
  }

  customerDetailsUpdated(details: object, isSecondaryCustomer = false) {
    if (isSecondaryCustomer) {
      this.store.dispatch(CustomerActions.secondaryDetailsUpdated({ data: details }));
    } else {
      this.store.dispatch(CustomerActions.primaryDetailsUpdated({ data: details }));
    }
  }

  clearForm(isSecondaryCustomer = false) {
    this.store.dispatch(CustomerActions.clearForm({ data: isSecondaryCustomer }));
  }

  swapForm() {
    this.store.dispatch(CustomerActions.swapForm());
  }

  copyForm() {
    this.store.dispatch(CustomerActions.copyForm());
  }

  copyCurrentAddress() {
    this.store.dispatch(CustomerActions.copyCurrentAddress());
  }

  copyInsuranceInfo() {
    this.store.dispatch(CustomerActions.copyInsuranceInfo());
  }

  customerTab(tab: CustomerTab) {
    this.store.dispatch(CustomerActions.customerTab({ data: tab }));
  }

  changeRelationship(relation: string) {
    this.store.dispatch(CustomerActions.changeRelationship({ data: relation }));
  }


}
