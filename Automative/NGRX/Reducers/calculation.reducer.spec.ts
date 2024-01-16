import {
  Customer,
  CustomerEnum,
  CustomerTab,
  CustomerType,
  DealType,
  DealTypeChange,
  FinanceTerm,
  OtherPayments,
  PurchaseUnit,
  RatedProduct,
  StartNumOrder,
  StateFeatureKey,
  TaxProfileChange,
  Term,
  TradeInDetails,
  Unit,
  UnitOptionOverview,
  UnitSetupType,
  WorksheetTab,
} from '@app/entities';
import { DealTabPath } from '../../enum';
import { DealOverview } from '../../models';
import { WorksheetData } from '../../testing';
import * as WorksheetActions from '../actions';
import * as CommonActions from '../actions/common.actions';
import { CommonState } from './common.reducer';
import { CustomerState } from './customer.reducer';
import { UnitsState } from './units.reducer';
import { WorksheetState, worksheetReducer } from './worksheet.reducer';
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
const unitOptionArray: UnitOptionOverview[] = [
  {
    id: 234,
    unitId: 234,
    numOrder: 234,
    partorRONo: 'test',
    type: 234,
    code: 'test',
    category: 'test',
    name: 'test',
    description: 'test',
    msrp: 234,
    dealerCost: 234,
    costPrice: 234,
    sellingPrice: 234,
    totalCostPrice: 234,
    totalSellingPrice: 234,
    quantity: 234,
    setupType: UnitSetupType.dealAdd,
  },
];
const commonState: CommonState = {
  currentTab: DealTabPath.Customer, 
  dealOverview: new DealOverview(),
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
    options: unitOptionArray,
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
    options: unitOptionArray,
  },
  loaded: false,
  openRatingDialog: false,
  unitLoaded: false
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
const product: RatedProduct[] = [
  {
    providerId: 6,
    providerName: 'BRP',
    isRated: true,
    unitId: 123,
    category: '',
    programId: 'brp',
    programName: 'BRP Program',
    productId: '1',
    productName: 'Brp',
    coverageId: 'brp',
    coverageName: 'test',
    coverageDescription: 'desc',
    coverageItemId: 'coverageId',
    term: 12,
    mileage: 234,
    deductible: 234,
    msrp: 0,
    costPrice: 0,
    totalCostPrice: 0,
    sellingPrice: 0,
    totalSellingPrice: 0,
    maxSellingPrice: 0,
    isSelected: false,
    surcharges: [],
    unitIds: [1, 2, 3],
  },
];
const worksheetDetails = WorksheetData;
const worksheetState: WorksheetState = {
  loaded: false,
  currentTab: WorksheetTab.PurchaseUnit,
  present: false,
  ratingDialog: false,
  currentChanges: worksheetDetails,
  previousChanges: worksheetDetails,
  dealerCostToggle: false,
  activeUnitIndex: null,
  activeUnitProductId: 0,
};
const initialState = {
  getState: StateFeatureKey.Deal,
  common: commonState,
  units: unitState,
  customer: customerState,
  worksheet: worksheetState,
};

describe('Worksheet Reducer', () => {
  it('should handle updatePurchaseUnitDetails action', () => {
    const payload = { ...new PurchaseUnit(), isDirty: true, isValid: true };
    const action = WorksheetActions.updatePurchaseUnitDetails({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;
    const { units } = currentChanges;
    const { isValid, isDirty } = payload;
    const unitIndex = units.findIndex((u) => u?.id == payload?.id);
    const updatedCurrentChanges = {
      ...currentChanges,
      units: units.map((u, i) => {
        if (unitIndex == i) {
          return Object.assign({}, u, { ...payload });
        }
        return u;
      }),
      isDirty,
      isValid,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateTradeInDetails action', () => {
    const payload = { ...new TradeInDetails(), isDirty: true, isValid: true };
    const action = WorksheetActions.updateTradeInDetails({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;
    const { tradeIns } = currentChanges;
    const { isValid, isDirty } = payload;
    const tradeInIndex = tradeIns.findIndex((t) => t.id == payload.id);

    const updatedCurrentChanges = {
      ...currentChanges,
      tradeIns: tradeIns.map((t, i) => {
        if (tradeInIndex == i) {
          return Object.assign({}, t, { ...payload });
        }
        return t;
      }),
      isDirty,
      isValid,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateOtherPayments action', () => {
    const payload = { ...new OtherPayments(), isDirty: true, isValid: true };
    const action = WorksheetActions.updateOtherPayments({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;

    const updatedCurrentChanges = {
      ...currentChanges,
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateFormStatus action', () => {
    const payload = { isDirty: true, isValid: true };
    const action = WorksheetActions.updateFormStatus({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;

    const updatedCurrentChanges = {
      ...currentChanges,
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateTaxesSuccess action', () => {
    const payload = { ...worksheetDetails };
    const action = WorksheetActions.updateTaxesSuccess({ data: WorksheetData});
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;

    const updatedCurrentChanges = {
      ...currentChanges,
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle calculateWorksheetDetailsSuccess action', () => {
    const payload = { ...worksheetDetails };
    const action = WorksheetActions.calculateWorksheetDetailsSuccess({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    expect(state.currentChanges.terms).toHaveLength(3);
  });

  it('should handle updateProtectionProducts action', () => {
    const payload = { products: product, unitIndex: 0, isValid: true, isDirty: true };
    const action = WorksheetActions.updateProtectionProducts({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const { products, unitIndex } = payload;
    const { currentChanges } = state;

    const isUnitProduct = unitIndex > -1;

    // Update State
    let updatedProps = {};
    if (isUnitProduct) {
      const units = currentChanges.units.map((u, i) => {
        if (i == unitIndex) return Object.assign({}, u, { products });
        return u;
      });

      updatedProps = { units };
    } else {
      updatedProps = { products };
    }
    const updatedCurrentChanges = {
      ...currentChanges,
      ...updatedProps,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle deleteProtectionProductSuccess action', () => {
    const payload = worksheetDetails;
    const action = WorksheetActions.deleteProtectionProductSuccess({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);

    const updatedCurrentChanges = {
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });
  it('should handle showRateProduct action', () => {
    const action = WorksheetActions.showRateProduct({ data: true });
    const state = worksheetReducer(initialState.worksheet, action);
    expect(state.ratingDialog).toStrictEqual(true);
    expect(state.present).toStrictEqual(true);
  });

  it('should handle hideRateProduct action', () => {
    const action = WorksheetActions.hideRateProduct({ data: true });
    const state = worksheetReducer(initialState.worksheet, action);
    expect(state.ratingDialog).toStrictEqual(false);
    expect(state.present).toStrictEqual(true);
  });

  it('should handle updateProductSelectionToggle action', () => {
    const action = WorksheetActions.updateProductSelectionToggle();
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;
    const { units, products } = currentChanges;
    let allProducts: RatedProduct[] = [];
    if (units) {
      units.forEach((item) => {
        const unitProducts = item.products;

        unitProducts.forEach((product) => {
          allProducts.push({ ...product });
        });
      });
    }

    allProducts = allProducts.concat(products);

    const updatedCurrentChanges = {
      ...currentChanges,
      includeSelectedProductsOnly: false,
      disableIncludeSelectedProductsOnly: true,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle worksheetTab action', () => {
    const action = WorksheetActions.worksheetTab({ data: WorksheetTab.FinanceTerms });
    const state = worksheetReducer(initialState.worksheet, action);

    expect(state.currentTab).toStrictEqual(WorksheetTab.FinanceTerms);
  });

  it('should handle resetTabEvent action', () => {
    const action = CommonActions.resetTabEvent();
    const state = worksheetReducer(initialState.worksheet, action);
    const currentChanges = worksheetDetails;
    const initialTerms = (terms: Term[] = []) => {
      const defaultValue = [1, 2, 3].map(() => new Term());
      for (let i = 0; i < terms?.length; i++) {
        defaultValue[i] = { ...terms[i] };
      }
      return defaultValue;
    };
    const updatedCurrentChanges = {
      ...currentChanges,
      terms: initialTerms(state.previousChanges.terms),
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateFinanceTerms action', () => {
    const payload = new FinanceTerm();
    const action = WorksheetActions.updateFinanceTerms({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const { currentChanges } = state;

    const updatedCurrentChanges = {
      ...currentChanges,
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateDealType action', () => {
    const payload: DealTypeChange = {
      dealType: DealType.Cash,
      isDirty: false,
      isValid: false,
    };
    const action = WorksheetActions.updateDealType({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const { currentChanges } = state;

    const updatedCurrentChanges = {
      ...currentChanges,
      ...payload,
    };
    expect(state.currentChanges).toStrictEqual(updatedCurrentChanges);
  });

  it('should handle updateTaxProfileType action', () => {
    const payload: TaxProfileChange = {
      taxProfileId: 230,
      id:17764,
      isDirty: false,
      isValid: true,
    };
    const action = WorksheetActions.updateTaxProfileType({ data: payload });
    const state = worksheetReducer(initialState.worksheet, action);
    const { currentChanges } = state;

    const updatedCurrentChanges = {
      ...currentChanges,
    };
    expect(state.currentChanges).toEqual(updatedCurrentChanges);
  });
});
