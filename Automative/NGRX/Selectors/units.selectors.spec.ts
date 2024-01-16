import { Customer, CustomerEnum, CustomerTab, CustomerType, StartNumOrder, StateFeatureKey, Unit, WorksheetTab } from '@app/entities';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import { CommonState, CustomerState, UnitsState, WorksheetState } from '../reducers';
import * as UnitsSelectors from './units.selectors';

const subUnit: Unit = {
  unitId: 1,
  numOrder: 101,
  type: 'A',
  subType: 'B',
  category: 'C',
  stockNo: 'D',
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
  isPodDrive: false,
  inServiceDate: 'test',
  isOEMWarrantyActive: false,
  oemWarrantyTermMonths: 107,
  oemWarrantyEndDate: 'test',
  msrp: 101,
  invoice: 101,
  bookValue: 101,
  unitUse: 2,
};
const units: Unit[] = [
  {
    unitId: 1,
    numOrder: 101,
    type: 'A',
    subType: 'B',
    category: 'C',
    stockNo: 'D',
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
    isPodDrive: false,
    isOEMWarrantyActive: false,
    oemWarrantyTermMonths: 107,
    oemWarrantyEndDate: 'test',
    msrp: 101,
    invoice: 101,
    bookValue: 101,
    unitUse: 2,
    subUnits: [subUnit],
  },
];
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
      items: units,
      activeTab: 0,
      isDirty: false,
      isValid: false,
      subActiveTab: 0,
      lastNumOrder: StartNumOrder.Unit,
    },
    options: [],
  },
  previousChanges: {
    units: {
      items: units,
      activeTab: 0,
      isDirty: false,
      isValid: false,
      subActiveTab: 0,
      lastNumOrder: StartNumOrder.Unit,
    },
    options: [],
  },
  loaded: false,
  unitLoaded: false,
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

describe('Unit Selectors', () => {
  it('should handle unitOptions', () => {
    const result = UnitsSelectors.unitOptions.projector(initialState.units);
    expect(result).toHaveLength(0);
  });

  it('should handle unitLoaded', () => {
    const { unitLoaded } = unitState;
    const result = UnitsSelectors.unitLoaded.projector(unitState);
    expect(result).toBe(unitLoaded);
  });

  it('should handle openRatingDialog', () => {
    const { openRatingDialog } = unitState;
    const result = UnitsSelectors.openRatingDialog.projector(unitState);
    expect(result).toBe(openRatingDialog);
  });

  it('should handle openRatingDialog', () => {
    const { openRatingDialog } = unitState;
    const result = UnitsSelectors.openRatingDialog.projector(unitState);
    expect(result).toBe(openRatingDialog);
  });

  it('should handle unitsTab ', () => {
    const { units } = unitState.currentChanges;
    const result = UnitsSelectors.unitsTab.projector(unitState);
    expect(result).toBe(units);
  });
  it('should handle lastNumOrder ', () => {
    const result = UnitsSelectors.lastNumOrder.projector(unitState.currentChanges.units);
    expect(result).toBe(1);
  });
  it('should handle unitsCount  ', () => {
    const result = UnitsSelectors.unitsCount.projector(unitState.currentChanges.units.items);
    expect(result).toBe(1);
  });
  it('should handle items', () => {
    const { units } = unitState.currentChanges;
    const result = UnitsSelectors.unitsTab.projector(unitState);
    expect(result).toStrictEqual(units);
  });
  it('should handle isValid ', () => {
    const result = UnitsSelectors.isValid.projector(unitState.currentChanges.units);
    expect(result).toBe(false);
  });

  it('should handle isDirty ', () => {
    const result = UnitsSelectors.isDirty.projector(unitState.currentChanges.units);
    expect(result).toBe(false);
  });

  it('should handle loaded', () => {
    const result = UnitsSelectors.loaded.projector(initialState.units);
    expect(result).toBe(false);
  });

  it('should return activeUnit', () => {
    const result = UnitsSelectors.activeUnit.projector(unitState.currentChanges.units);
    const { items, activeTab } = unitState.currentChanges.units;
    const unit = { ...items[activeTab] };
    const { isOEMWarrantyActive } = unit;
    const warrantyStatus = isOEMWarrantyActive != null ? Number(isOEMWarrantyActive).toString() : null;

    expect(result.warrantyStatus).toEqual(warrantyStatus);
  });
});
