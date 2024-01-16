import { Action } from '@ngrx/store';
import {
  Customer,
  CustomerEnum,
  CustomerTab,
  CustomerType,
  DealTabType,
  DealType,
  PaymentCalculatorResponse,
  StartNumOrder,
  StateFeatureKey,
  Unit,
  UpdateContactsRequest,
  WorksheetTab,
} from '@app/entities';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import { DealOverview } from '../../models';
import { DealLendersData, DealOverviewData, dealData } from '../../testing';
import * as DealActions from '../actions';
import { CommonState, commonReducer, initialCommonState } from './common.reducer';
import { CustomerState } from './customer.reducer';
import { UnitsState } from './units.reducer';
import { WorksheetState } from './worksheet.reducer';
import { MockTaxRateData, TaxRateData } from '@app/features/tax-profile/tax-profile-configuration';

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
    deliveryDate: new Date().toString(),
    description: 'test',
    color: 'Red',
  },
];
const dealOverview: DealOverview = {
  id: 1,
  orgId: 2,
  salesPerson: 'app',
  fAndIPerson: 'app',
  customerName: 'Mack',
  primaryUnit: 'app',
  dealType: DealType.Cash,
  totalAmount: 100,
  lenderName: 'xyz',
  createDateTimeUtc: null,
  lastUpdateDateTimeUtc: null,
  imported: false,
  importDealNo: 'xyz',
  isCustomerLocked: true,
  isUnitLocked: true,
  isPartAccessoriesLocked: true,
  isWorksheetLocked: true,
  isContractsGenerated: false,
  isLenderLocked: false,
};

const commonState: CommonState = {
  loaded: false,
  currentTab: DealTabPath.Customer,
  dealOverview: dealOverview,
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
      unitsReordered: false
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
      unitsReordered: false
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
  activeUnitIndex: null,
  dealerCostToggle: false,
  activeUnitProductId: 0,
};
const initialState = {
  getState: StateFeatureKey.Deal,
  common: commonState,
  units: unitState,
  customer: customerState,
  worksheet: worksheetState,
};

describe('Common Reducer', () => {

  it('should handle primaryCustomerNameUpdate action', () => {
    const payload = 'Primary Customer';
    const action = DealActions.primaryCustomerNameUpdate({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.customerName).toBe('Primary Customer');
  });
  it('should handle updateLenderName action', () => {
    const payload = DealLendersData;
    const action = DealActions.updateLenderName({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.customerName).toBe('Mack');
  });
  it('should handle updateDocsNotesCount action', () => {
    const payload = DealOverviewData;
    const action = DealActions.updateDocsNotesCount({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.customerName).toBe('Mack');
  });
  it('should handle lastUpdateDateTimeUpdate action', () => {
    const action = DealActions.lastUpdateDateTimeUpdate();
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.customerName).toBe('Mack');
  });
  it('should handle resetDealType action', () => {
    const action = DealActions.resetDealType();
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.customerName).toBe('Mack');
  });

  it('should handle totalDealAmountUpdate action', () => {
    const payload = { totalAmount: 3, dealType: DealType.Cash };
    const action = DealActions.totalDealAmountUpdate({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.totalAmount).toBe(payload.totalAmount);
    expect(state.dealOverview.dealType).toBe(payload.dealType);
  });

  it('should handle updateDealTabLocks action', () => {
    const payload = {
      isCustomerLocked: true,
      isUnitLocked: true,
      isWorksheetLocked: true,
    };
    const action = DealActions.updateDealTabLocks({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.isCustomerLocked).toBe(true);
    expect(state.dealOverview.isUnitLocked).toBe(true);
    expect(state.dealOverview.isWorksheetLocked).toBe(true);
  });

  it('should handle primaryUnitUpdate action', () => {
    const primaryUnit = 'PV13';
    const action = DealActions.primaryUnitUpdate({ data: primaryUnit });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.primaryUnit).toBe(primaryUnit);
  });
  it('should handle updateContactsSuccess action', () => {
    const payload: UpdateContactsRequest = {
      salesPerson: 'Sale Person',
    };
    const action = DealActions.updateContactsSuccess({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.salesPerson).toBe(payload.salesPerson);
  });

  describe('Common updateDealTabUnLocksSuccess', () => {
    it('should handle updateDealTabUnLocksSuccess action', () => {
      const payload = {
        isVoidSuccess: false,
        errors: [],
        currentTab: DealTabType.Customer,
      };
      const action = DealActions.updateDealTabUnLocksSuccess({ data: payload });
      const state = commonReducer(initialState.common, action);
      expect(state.dealOverview).toStrictEqual({ ...dealOverview, isCustomerLocked: false });
    });

    it('should handle updateDealTabUnLocksSuccess units tab action', () => {
      const payload = {
        isVoidSuccess: false,
        errors: [],
        currentTab: DealTabType.Units,
      };
      const action = DealActions.updateDealTabUnLocksSuccess({ data: payload });
      const state = commonReducer(initialState.common, action);
      expect(state.dealOverview).toStrictEqual({
        ...dealOverview,
        isUnitLocked: false,
        isWorksheetLocked: false,
        isCustomerLocked: false,
        isPartAccessoriesLocked: false,
      });
    });
    it('should handle updateDealTabUnLocksSuccess lender tab action', () => {
      const payload = {
        isVoidSuccess: false,
        errors: [],
        currentTab: DealTabType.Lender,
      };
      const action = DealActions.updateDealTabUnLocksSuccess({ data: payload });
      const state = commonReducer(initialState.common, action);
      expect(state.dealOverview).toStrictEqual({
        ...dealOverview,
        isUnitLocked: false,
        isWorksheetLocked: false,
        isCustomerLocked: false,
        isPartAccessoriesLocked: true,
        isLenderLocked: false,
      });
    });
  });

  it('should handle dealTab action', () => {
    const payload = DealTabPath.Customer;
    const action = DealActions.dealTab({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.currentTab).toBe(payload);
  });

  it('should handle changeSalesPersonSuccess action', () => {
    const payload: UpdateContactsRequest = {
      salesPerson: 'Sale Person',
    };
    const action = DealActions.updateContactsSuccess({ data: payload });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.salesPerson).toBe(payload.salesPerson);
  });

  it('should handle resetEvent action', () => {
    Object.assign({}, initialCommonState);
    const action = DealActions.resetEvent();
    const state = commonReducer(initialState.common, action);
    // expect(state.dealId).toBe(0);
  });
  it('should return the previous state', () => {
    const action = {} as Action;
    const result = commonReducer(initialCommonState, action);
    expect(result).toBe(initialCommonState);
  });

  it('should handle dealTab action', () => {
    const date = new Date();
    const action = DealActions.setDeliveryDate({ data: date });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.deliveryDate).toBe(date);
  });
  it('should handle set notes count action', () => {
    const action = DealActions.setNotesCount({ data: 1 });
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.notesCount).toBe(1);
  });
  it('should handle update notes count action', () => {
    const action = DealActions.updateNotesCount();
    const state = commonReducer(initialState.common, action);
    expect(state.dealOverview.notesCount).toBe(state.dealOverview.notesCount + 1);
  });
  
  it('should handle getDealSuccess  action', () => {
    const action = DealActions.getDealSuccess(dealData[0]);
    const state = commonReducer(initialState.common, action);
    expect(state.loaded).toBe(true);
  });
  it('should handle getCustomerTaxRatesFailure  action', () => {
    const action = DealActions.dealTab({data : DealTabPath.Checklists});
    const state = commonReducer(initialState.common, action);
    expect(state.loaded).toBe(false);
  });
});
