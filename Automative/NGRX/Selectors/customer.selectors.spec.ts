import { Customer, CustomerEnum, CustomerPersonalDetails, CustomerTab, CustomerType, StartNumOrder, StateFeatureKey, WorksheetTab } from '@app/entities';
import { DealTabPath } from '../../enum';
import { CommonState, CustomerState, UnitsState, WorksheetState } from '../reducers';
import * as CustomerSelectors from './customer.selectors';
const commonState: CommonState = {
  loaded: false,
  currentTab: DealTabPath.Customer,
  dealOverview: null,
  paymentCalculatorDetails: null,
  isDealTypeChanged: false,
};
const unitState: UnitsState = {
  currentChanges: {
    units: {
      items: [],
      activeTab: -1,
      isDirty: false,
      isValid: false,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
    },
    options: [],
  },
  previousChanges: {
    units: {
      items: [],
      activeTab: -1,
      isDirty: false,
      isValid: false,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
    },
    options: [],
  },
  loaded: false,
  openRatingDialog: false,
  unitLoaded: false,
};
const customerState: CustomerState = {
  currentChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    isDirty: false,
    isValid: true,
  },
  previousChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    isDirty: false,
    isValid: true,
  },
  loaded: false,
  currentTab: CustomerTab.PersonalInformation,
};
const worksheetState: WorksheetState = {
  loaded: false,
  currentTab: WorksheetTab.PurchaseUnit,
  present: false,
  ratingDialog: false,
  currentChanges: null,
  previousChanges: null,
  dealerCostToggle: false,
  activeUnitIndex: null,
  saveOnClose: false,
  activeUnitProductId: 0,
};
const initialState = {
  getState: StateFeatureKey.Deal,
  common: commonState,
  units: unitState,
  customer: customerState,
  worksheet: worksheetState,
};

const basicDetails: CustomerPersonalDetails = {
  numOrder: 1,
  businessType: 'type',
  workPhone: '(765) 432-3456',
  taxId: '546554',
  isBusiness: false,
  firstName: 'T',
  middleName: 'E',
  lastName: 'S',
  fullName: 'Mohit',
  suffix: 'T',
  email: 'vikramjeetwins@gmail.com',
  mobilePhone: '(765) 432-3456',
  homePhone: '(765) 432-3456',
  idType: '2',
  idNumber: '4354',
  idState: 'test',
  idExpiration: '05-04-2022',
  dob: '02-12-2022',
  relationship: 'test',
  businessName: 'Soft',
};

const customer: Customer = {
  customerId: 2,
  personalInfo: basicDetails,
  currentAddress: null,
  mailingAddress: null,
  insuranceInfo: null,
  isMailingSame: false,
};
describe('Dealer Customer Selectors', () => {
  it('should handle primaryCustomer', () => {
    const result = CustomerSelectors.primaryCustomer.projector(initialState.customer.currentChanges);
    expect(result.isMailingSame).toBe(true);
  });

  it('should handle primaryCustomerName', () => {
    const fullName = CustomerSelectors.primaryCustomerName.projector(initialState.customer.currentChanges.customerType, customer);
    expect(fullName).toBe('T E S T');
  });

  it('should handle primaryBasicDetails', () => {
    const result = CustomerSelectors.primaryBasicDetails.projector(customer);
    expect(result).toBe(basicDetails);
  });

  it('should handle secondaryCustomer', () => {
    const result = CustomerSelectors.secondaryCustomer.projector(initialState.customer.currentChanges);
    expect(result.isMailingSame).toBe(true);
  });
  it('should handle secondaryBasicDetails', () => {
    const result = CustomerSelectors.secondaryBasicDetails.projector(customer);
    expect(result).toBe(basicDetails);
  });

  it('should return the currentChanges property of the CustomerState', () => {
    const expectedData = {
      customerType: CustomerType.Individual,
      primaryCustomer: new Customer(CustomerEnum.Primary),
      secondaryCustomer: new Customer(CustomerEnum.Secondary),
      isDirty: false,
      isValid: true,
    };
    const result = CustomerSelectors.customerData.projector(initialState.customer);
    expect(result).toEqual(expectedData);
  });

  it('should return the customerType property of the CustomerData', () => {
    const expectedCustomerType = CustomerType.Individual;
    const result = CustomerSelectors.customerType.projector(initialState.customer.currentChanges);
    expect(result).toEqual(expectedCustomerType);
  });

  it('should return the isValid property of the CustomerData', () => {
    const expectedIsValid = true;
    const result = CustomerSelectors.isCustomerValid.projector(initialState.customer.currentChanges);
    expect(result).toEqual(expectedIsValid);
  });

  it('should return the validAddressTab property of the CustomerData', () => {
    const result = CustomerSelectors.validAddressTab.projector(initialState.customer.currentChanges);
    expect(result).toEqual(undefined);
  });

  it('should return the computed full name for secondary customer', () => {
    const expectedFullName = 'T E S T';
    const result = CustomerSelectors.secondaryCustomerName.projector(customer);
    expect(result).toEqual(expectedFullName);
  });
});
