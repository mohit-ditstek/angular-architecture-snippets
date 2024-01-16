import { Action } from '@ngrx/store';
import {
  Address,
  Customer,
  CustomerEnum,
  CustomerPersonalDetails,
  CustomerTab,
  CustomerType,
  StartNumOrder,
  StateFeatureKey,
  Unit,
  WorksheetTab
} from '@app/entities';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import { CustomerDetails } from '../../models';
import * as CommonActions from '../actions/common.actions';
import * as CustomerActions from '../actions/customer.action';
import { CommonState } from './common.reducer';
import { CustomerState, customerReducer } from './customer.reducer';
import { UnitsState } from './units.reducer';
import { WorksheetState } from './worksheet.reducer';
const units: Unit[] = [
  {
    unitId: 1,
    numOrder: 101,
    type: 'A',
    subType: 'B',
    category: 'C',
    stockNo: 'D',
    unitUse: 3,
    age: 102,
    vin: '1112344',
    year: 103,
    make: 'Tata',
    model: '2022',
    trim: 'sd',
    mileage: 104,
    hours: 105,
    axleCount: 106,
    warrantyStatus: 'test',
    engineSize: 1,
    engineSizeType: 1,
    inServiceDate: 'test',
    isOEMWarrantyActive: false,
    oemWarrantyTermMonths: 107,
    oemWarrantyEndDate: 'test',
    msrp: 101,
    invoice: 101,
    bookValue: 101,
  },
];
const commonState: CommonState = {
  currentTab: DealTabPath.Customer,
  dealOverview: null,
  loaded: false,
  paymentCalculatorDetails: null,
  isDealTypeChanged: false,
};

const unitState: UnitsState = {
  currentChanges: {
    units: {
      items: units,
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
      items: units,
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
  activeUnitIndex: null,
  dealerCostToggle: false,
  saveOnClose: false,
  activeUnitProductId: 0
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
const customerPersonalDetails: CustomerPersonalDetails = {
  numOrder: 2,
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
const customer: Customer[] = [
  {
    customerId: 1,
    personalInfo: basicDetails,
    currentAddress: null,
    mailingAddress: null,
    insuranceInfo: null,
    isMailingSame: false,
  },
  {
    customerId: 2,
    personalInfo: customerPersonalDetails,
    currentAddress: null,
    mailingAddress: null,
    insuranceInfo: null,
    isMailingSame: true,
  },
];
const customerDetail: CustomerDetails = {
  customerType: CustomerType.Business,
  customers: customer,
  isValidationDisabled: false,
};

describe('Customer Reducer', () => {
  describe('getDealSuccess action', () => {
    it('should handle getDealSuccess action', () => {
      const payload = CustomerType.Individual;
      const action = CustomerActions.changeCustomerType({ data: payload });
      const state = customerReducer(initialState.customer, action);
      expect(state.currentChanges.customerType).toBe(payload);
    });
    it('should handle getDealSuccess business action', () => {
      const payload = CustomerType.Business;
      const action = CustomerActions.changeCustomerType({ data: payload });
      const state = customerReducer(initialState.customer, action);
      expect(state.currentChanges.customerType).toBe(payload);
    });
  });
  it('should handle getCustomersSuccess action', () => {
    const payload = customerDetail;
    const action = CustomerActions.getCustomersSuccess({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.customerType).toBe(payload.customerType);
  });

  it('should handle getCustomersSuccess action with incorrect order number', () => {
    const payload = customerDetail;
    payload.customers[0].personalInfo.numOrder = 3;
    payload.customers[1].personalInfo.numOrder = 4;
    const action = CustomerActions.getCustomersSuccess({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.customerType).toBe(payload.customerType);
  });

  it('should handle saveCustomersSuccess action', () => {
    const payload = [1, 2];
    const action = CustomerActions.updateCustomersSuccess({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.primaryCustomer.isMailingSame).toBe(true);
  });

  it('should handle primaryDetailsUpdated action', () => {
    const payload = customerState.currentChanges.primaryCustomer;
    const action = CustomerActions.primaryDetailsUpdated({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.primaryCustomer.isMailingSame).toBe(true);
  });

  it('should handle secondaryDetailsUpdated action', () => {
    const payload = customerState.currentChanges.secondaryCustomer;
    const action = CustomerActions.secondaryDetailsUpdated({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.primaryCustomer.isMailingSame).toBe(true);
  });

  it('should handle customerAddressUpdated action', () => {
    const address: Address = {
      type: 'XYZ',
      address: 'Cent jonn',
      unitNo: 'UN12',
      city: 'A',
      state: 'B',
      county: 'United State',
      country: 'US',
      zipCode: '454565',
      googlePlaceId: 'dfhj4549gfej',
      isDirty: false,
      isValid: false,
    };
    const isSecondaryCustomer = false;
    const action = CustomerActions.primaryDetailsUpdated({ data: { address, isSecondaryCustomer } });
    const state = customerReducer(initialState.customer, action);
    expect(state.currentChanges.primaryCustomer.isMailingSame).toBe(true);
  });

  it('should handle clearForm action', () => {
    const payload = true;
    const action = CustomerActions.clearForm({ data: payload });
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle swapForm action', () => {
    const action = CustomerActions.swapForm();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle copyCurrentAddress action', () => {
    const action = CustomerActions.copyCurrentAddress();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });
  it('should handle copyInsuranceInfo action', () => {
    const action = CustomerActions.copyInsuranceInfo();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle copyForm action', () => {
    const action = CustomerActions.copyForm();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle resetEvent action', () => {
    const action = CommonActions.resetEvent();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle resetTabEvent action', () => {
    const action = CommonActions.resetTabEvent();
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle customerTab action', () => {
    const action = CustomerActions.customerTab({ data: CustomerTab.AddressInformation });
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });

  it('should handle changeRelationship action', () => {
    const action = CustomerActions.changeRelationship({ data: '' });
    const state = customerReducer(initialState.customer, action);
    expect(state).toBeTruthy();
  });
  it('should return the previous state', () => {
    const action = {} as Action;
    const result = customerReducer(initialState.customer, action);
    expect(result).toBe(initialState.customer);
  });
});
