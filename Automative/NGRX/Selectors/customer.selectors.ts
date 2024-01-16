import { createSelector } from '@ngrx/store';
import { Address, Customer, CustomerData, CustomerType } from '@app/entities';
import { computeFullName } from '../../helpers';
import { State } from '../deal.state';
import { CustomerState } from '../reducers';
import { getDealState } from './root.selector';

export const customerSelector = createSelector(getDealState, (state: State) => state.customer);
export const customerLoaded = createSelector(customerSelector, (state: CustomerState) => state.loaded);

export const currentCustomerTab = createSelector(customerSelector, (state: CustomerState) => state.currentTab);

export const customerData = createSelector(customerSelector, (state: CustomerState) => state.currentChanges);
export const customerType = createSelector(customerData, (customerData: CustomerData) => customerData.customerType);

export const isCustomerValid = createSelector(customerData, (customerData: CustomerData) => customerData.isValid);
export const primaryCustomer = createSelector(customerData, (customerData: CustomerData) => customerData.primaryCustomer);
export const validAddressTab = createSelector(customerData, (customerData: CustomerData) => customerData.validAddressTab);

export const primaryCustomerName = createSelector(customerType, primaryCustomer, (customerType: CustomerType, customer: Customer) => {
  const { personalInfo } = customer;
  return computeFullName(customerType, personalInfo);
});

export const secondaryCustomer = createSelector(customerData, (customerData: CustomerData) => customerData.secondaryCustomer);

export const secondaryCustomerName = createSelector(secondaryCustomer, (customer: Customer) => {
  const { personalInfo } = customer;
  return computeFullName(CustomerType.Individual, personalInfo);
});

export const relationship = createSelector(secondaryCustomer, (secondaryCustomer) => secondaryCustomer.personalInfo.relationship);

export const primaryBasicDetails = createSelector(primaryCustomer, (customer: Customer) => customer.personalInfo);
export const secondaryBasicDetails = createSelector(secondaryCustomer, (customer: Customer) => customer.personalInfo);

export const customerLayoutViewModel = createSelector(
  customerLoaded,
  customerType,
  currentCustomerTab,
  primaryCustomerName,
  secondaryCustomerName,
  secondaryBasicDetails,
  isCustomerValid,
  (
    customerLoaded, 
    customerType, 
    currentCustomerTab, 
    primaryCustomerName, 
    secondaryCustomerName, 
    secondaryBasicDetails, 
    isCustomerValid
  ) => {
    const canNavigateFromPersonal =  isCustomerValid;
    return { loaded: customerLoaded, customerType, currentCustomerTab, primaryCustomerName, secondaryCustomerName, relationship: secondaryBasicDetails.relationship, canNavigateFromPersonal };
  }
);

// Customer

export const customerOverviewViewModel = createSelector(
  customerType,
  primaryCustomerName,
  secondaryCustomerName,
  (customerType, primaryCustomerName, secondaryCustomerName) => ({
    customerType,
    primaryCustomerName,
    secondaryCustomerName
  })
);

export const customerDetailViewModel = createSelector(
  customerType,
  primaryCustomerName,
  secondaryCustomerName,
  primaryBasicDetails,
  secondaryBasicDetails,
  primaryCustomer,
  secondaryCustomer,
  (customerType, primaryCustomerName, secondaryCustomerName, primaryBasicDetails, secondaryBasicDetails, primaryCustomer: Customer, secondaryCustomer: Customer) => ({
    customerType,
    primaryCustomerName,
    secondaryCustomerName,
    primaryBasicDetails,
    secondaryBasicDetails,
    primaryCustomerCurrentAddress: primaryCustomer.currentAddress || new Address(),
    primaryCustomerMailingAddress: primaryCustomer.mailingAddress || new Address(),
    primaryCustomerIsMailingDifferent: !primaryCustomer.isMailingSame,
    secondaryCustomerCurrentAddress: secondaryCustomer.currentAddress || new Address(),
    secondaryCustomerMailingAddress: secondaryCustomer.mailingAddress || new Address(),
    secondaryCustomerIsMailingDifferent: !secondaryCustomer.isMailingSame,
  })
);

// address
export const addressViewModel = createSelector(
  primaryCustomer,
  secondaryCustomer,

  (primaryCustomer: Customer, secondaryCustomer: Customer) => {
    return {
      primaryCustomerCurrentAddress: primaryCustomer.currentAddress || new Address(),
      primaryCustomerMailingAddress: primaryCustomer.mailingAddress || new Address(),
      primaryCustomerIsMailingDifferent: !primaryCustomer.isMailingSame,
      secondaryCustomerCurrentAddress: secondaryCustomer.currentAddress || new Address(),
      secondaryCustomerMailingAddress: secondaryCustomer.mailingAddress || new Address(),
      secondaryCustomerIsMailingDifferent: !secondaryCustomer.isMailingSame,
    };
  }
);

// insurance detail

export const insuranceViewModel = createSelector(
  primaryCustomer,
  secondaryCustomer,
  (primaryCustomer: Customer, secondaryCustomer: Customer) => {
    return {
      primaryInsuranceInfo: primaryCustomer.insuranceInfo,
      secondaryInsuranceInfo: secondaryCustomer.insuranceInfo
    };
  }
);

export const customerSummaryDetailViewModel = createSelector(
  customerType,
  primaryCustomer,
  secondaryCustomer,
  (customerType, primaryCustomer, secondaryCustomer) => ({
    customerType,
    primaryCustomer,
    secondaryCustomer
  })
);

export const printCustomerViewModel = createSelector(
  customerType,
  primaryCustomerName,
  secondaryCustomerName,
  (customerType, primaryCustomerName, secondaryCustomerName) => ({
    customerType,
    primaryCustomerName,
    secondaryCustomerName,
  })
);