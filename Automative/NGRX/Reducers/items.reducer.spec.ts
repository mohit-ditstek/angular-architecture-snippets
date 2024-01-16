import {
  ContractUnit,
  Customer,
  CustomerEnum,
  CustomerTab,
  CustomerType,
  StartNumOrder,
  StateFeatureKey,
  Unit,
  UnitAgeType,
  UnitData,
  UnitInfo,
  UnitMarineSubType,
  UnitOption,
  UnitOverviewData,
  UnitSetupType,
  UnitType,
  UnitsData,
  WorksheetTab,
} from '@app/entities';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import * as CommonActions from '../actions/common.actions';
import * as UnitActions from '../actions/units.action';
import { CommonState } from './common.reducer';
import { CustomerState } from './customer.reducer';
import { UnitsState, unitsReducer } from './units.reducer';
import { WorksheetState } from './worksheet.reducer';

const unitOption: UnitOption = {
  id: 3,
  unitId: 234,
  type: 234,
  category: 'test',
  name: 'test',
  quantity: 234,
  sellingPrice: 234,
  totalPrice: 234,
  unitName: 'test',
  partorRONo: 'test',
  totalSellingPrice: 234,
  description: 'test',
  overrideSellingPrice: false,
  setupType: UnitSetupType.dealAdd,
  costPrice: 0,
  totalCostPrice: 0,
  overrideCostPrice: false,
};

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
      items: [UnitData],
      activeTab: 0,
      isDirty: false,
      isValid: false,
      subActiveTab: 0,
      lastNumOrder: StartNumOrder.Unit,
      unitsReordered: true
    },
    options: UnitOverviewData,
  },
  previousChanges: {
    units: {
      items: [UnitData],
      activeTab: 0,
      isDirty: false,
      isValid: false,
      subActiveTab: 1,
      lastNumOrder: StartNumOrder.Unit,
      unitsReordered: true
    },
    options: UnitOverviewData,
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

const mockUniData : ContractUnit[] =[{
  id: 80,
  name: 'Test',
  inServiceDate: 'Wed Apr 10 2024 17:58:44 GMT+0530',
  deliveryDate: 'Wed Apr 10 2024 17:58:44 GMT+0530',
  selectedProducts: [],
  age: UnitAgeType.CPO,
  selectedAll: false,
  isInServiceDateVisible: false
}];

const unitData: UnitInfo = {
  options: UnitOverviewData,
  units: [UnitData],
};
describe('Unit Reducer', () => {
  it('should handle addUnit action', () => {
    const action = UnitActions.addUnit();
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.units.items[0].numOrder).toBe(670);
  });

  it('should handle unitTabChange action', () => {
    const payload = 2;
    const action = UnitActions.unitTabChange({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state).toBeTruthy();
  });
  it('should handle unitSubTabChange action', () => {
    const payload = 2;
    const action = UnitActions.unitSubTabChange({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state).toBeTruthy();
  });

  it('should handle deleteUnitSuccess action', () => {
    const payload = 0;
    const action = UnitActions.deleteUnitSuccess({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.units.items).toHaveLength(1);
  });

  it('should handle getUnitsTabDataSuccess action', () => {
    const payload = unitData;
    const action = UnitActions.getUnitsTabDataSuccess({ data: payload });
    const state = unitsReducer(initialState.units, action);

    const { units, options } = payload;
    const unitsCount = units.length;
    const unitItems = unitsCount > 0 ? units : [new Unit(StartNumOrder.Unit)];

    // numOrder computation
    const numOrder = Math.max(...unitItems.map((u) => u.numOrder));

    const groupedUnits: Unit[] = [];

    const mainUnits = unitItems.filter((u) => !u.mainUnitId);
    for (const unit of mainUnits) {
      let subUnits = [];
      if (unit.type == UnitType.Marine) {
        subUnits = unitItems.filter((u) => u.mainUnitId == unit.unitId);
      }

      groupedUnits.push({ ...unit, subUnits });
    }

    // TODO: Need to remove once multiple delete api is done.
    if (groupedUnits.length == 0) {
      groupedUnits.push(new Unit(StartNumOrder.Unit));
    }

    const loaded = state.loaded;
    const { activeTab, subActiveTab, isDirty, isValid } = state.currentChanges.units;

    const updatedDetails = {
      units: {
        items: groupedUnits,
        activeTab: loaded ? activeTab : 0,
        subActiveTab: loaded ? subActiveTab : -1,
        lastNumOrder: numOrder,
        isDirty: loaded ? isDirty : false,
        isValid: loaded ? isValid : unitsCount > 0,
        unitsReordered: false
      },
      options: options,
    };
    expect(state.currentChanges).toStrictEqual({ ...updatedDetails });
  });
  it('should handle updateUnitSuccess action', () => {
    const payload = UnitData;
    const action = UnitActions.updateUnitSuccess({ data: payload });
    const state = unitsReducer(initialState.units, action);
    const { currentChanges } = state;
    const { units } = currentChanges;
    expect(state.currentChanges.units).toStrictEqual(units);
    expect(state.previousChanges.units).toStrictEqual(units);
  });

  it('should handle updateUnitSuccess action on  marine subtype', () => {
    const payload = { ...UnitData, subType: UnitMarineSubType.Engine };
    const action = UnitActions.updateUnitSuccess({ data: payload });
    const state = unitsReducer(initialState.units, action);
    const { currentChanges } = state;
    const { units } = currentChanges;
    expect(state.currentChanges.units).toStrictEqual(units);
    expect(state.previousChanges.units).toStrictEqual(units);
  });


  it('should handle unitDetailsUpdated action', () => {
    const unitDetails = UnitData;
    const isDirty = false;
    const isValid = false;
    const action = UnitActions.unitDetailsUpdated({ data: { unitDetails, isDirty, isValid } });
    const state = unitsReducer(initialState.units, action);
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { items, activeTab, subActiveTab } = units;

    const updatedUnits = {
      ...units,
      items: items.map((u, i) => {
        if (activeTab == i) {
          if (subActiveTab > -1) {
            const subUnits = u?.subUnits.map((su, index) => {
              if (subActiveTab == index) {
                return Object.assign({}, { ...unitDetails });
              }
              return su;
            });

            return Object.assign({}, u, { subUnits });
          }

          return Object.assign({}, { ...unitDetails });
        }

        return u;
      }),
      isDirty,
      isValid,
    };
    expect(state.currentChanges.units).toStrictEqual({ ...updatedUnits });
  });

  it('should handle autoSaveUnitSuccess action', () => {
    const action = UnitActions.autoSaveUnitSuccess({ data: UnitData });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.options).toHaveLength(1);
  });

  it('should handle deleteSubUnitSuccess action', () => {
    const action = UnitActions.deleteSubUnitSuccess({ data: 1 });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.options).toHaveLength(1);
  });

  it('should handle updateUnitType action', () => {
    const payload = { type: 'test', activeUnitTab: 3 };
    const action = UnitActions.updateUnitType({ data: payload });
    const state = unitsReducer(initialState.units, action);
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { items } = units;
    const updatedItems = items.map((u, i) => {
      if (i == 1) {
        u = { ...u, type: 'test' };
      }
      return u;
    });

    expect(state.currentChanges.units.items).toStrictEqual(updatedItems);
  });

  it('should handle editAccessorySuccess action', () => {
    const unitOptions = unitOption;
    const action = UnitActions.editAccessorySuccess({ data: unitOptions });
    const state = unitsReducer(initialState.units, action);
    const { currentChanges } = state;
    const { options } = currentChanges;
    const unitOptionIndex = options.findIndex((a) => a.id == unitOptions.id);
    const updatedOptions = options.map((a, i) => {
      if (unitOptionIndex == i) {
        return Object.assign({}, a, unitOptions);
      }
      return a;
    });
    expect(state.currentChanges.options).toStrictEqual(updatedOptions);
    expect(state.previousChanges.options).toStrictEqual(updatedOptions);
  });

  it('should handle addAccessorySuccess action', () => {
    const unitOptions = {
      unitId: 234,
      type: 234,
      category: 'test',
      name: 'tes1t',
      quantity: 234,
      sellingPrice: 234,
      totalPrice: 234,
      unitName: 'testq',
      partorRONo: 'test',
      totalSellingPrice: 234,
      description: 'test',
      overrideSellingPrice: false,
      setupType: UnitSetupType.dealAdd,
      costPrice: 0,
      totalCostPrice: 0,
      overrideCostPrice: false,
    };

    const action = UnitActions.addAccessorySuccess({ data: unitOptions });
    const state = unitsReducer(initialState.units, action);

    expect(state.currentChanges.options).toHaveLength(2);
    expect(state.previousChanges.options).toHaveLength(1);
  });
  it('should handle deleteAccessory action', () => {
    const unitOptions = unitOption;
    const action = UnitActions.deleteAccessory({ data: unitOptions });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.options).toHaveLength(0);
  });

  it('should handle resetEvent action', () => {
    const action = CommonActions.resetEvent();
    const state = unitsReducer(initialState.units, action);
    expect(state).toBeTruthy();
  });
  it('should handle resetTabEvent action', () => {
    const action = CommonActions.resetTabEvent();
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });

  it('should handle addSubUnit action', () => {
    const payload = { clone: true, subType: UnitMarineSubType.Engine };
    const action = UnitActions.addSubUnit({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });
  it('should handle addSubUnit action', () => {
    const payload = { clone: false, subType: UnitMarineSubType.Engine };
    const action = UnitActions.addSubUnit({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });
  it('should handle updateUnitsAfterValidate action', () => {
    const payload = UnitsData;
    const action = UnitActions.updateUnitsAfterValidate({ data: payload });
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });
  it('should handle updateUnitFormStatus action', () => {
    const action = UnitActions.updateUnitFormStatus({ data: { formDirty: true, formValid: true } });
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });
  it('should handle autoSaveMultiUnitSuccess action', () => {
    const action = UnitActions.autoSaveMultiUnitSuccess({ data: { units: UnitsData } });
    const state = unitsReducer(initialState.units, action);
    expect(state.loaded).toBe(false);
  });

  it('should handle addImportUnitSuccess action', () => {
    const action = UnitActions.addImportUnitSuccess({ data: 1 });
    const state = unitsReducer(initialState.units, action);
    expect(state.unitLoaded).toBe(false);
  });
  it('should handle updateImportUnitSuccess action', () => {
    const action = UnitActions.updateImportUnitSuccess();
    const state = unitsReducer(initialState.units, action);
    expect(state.unitLoaded).toBe(false);
  });

  it('should handle autoSaveUnitFailure action', () => {
    const action = UnitActions.autoSaveUnitFailure();
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.units.isDirty).toBe(false);
  });

  it('should handle updateUnitsDetail action', () => {
    const action = UnitActions.updateUnitsDetail({data:mockUniData });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.units.isDirty).toBe(false);
  });
  it('should handle updateUnitsDetail action', () => {
    const action = UnitActions.reorderUnits({data:{  tabs: [1,2],
      previousIndex: 1,
      currentIndex: 22}
    });
    const state = unitsReducer(initialState.units, action);
    expect(state.currentChanges.units.isDirty).toBe(true);
  });
});
