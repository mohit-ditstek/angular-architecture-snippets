import { Action, createReducer, on } from '@ngrx/store';
import { RatedProduct, WorksheetTab, PurchaseUnit, Term, WorksheetDetails, hasDuplicateProductSelected, DealType, ProductCategory } from '@app/entities';
import * as WorksheetActions from '../actions';

export interface WorksheetState {
  loaded: boolean;
  currentTab: WorksheetTab;
  present: boolean;
  ratingDialog: boolean;
  currentChanges: WorksheetDetails;
  previousChanges: WorksheetDetails;
  dealerCostToggle: boolean;
  activeUnitIndex: number;
  activeUnitProductId: number;
}

export const initialWorksheetState: WorksheetState = {
  loaded: false,
  currentTab: WorksheetTab.PurchaseUnit,
  present: false,
  ratingDialog: false,
  currentChanges: null,
  previousChanges: null,
  dealerCostToggle: false,
  activeUnitIndex: null,
  activeUnitProductId: null,
};

const initialTerms = (terms: Term[] = []) => {
  const defaultValue = [1, 2, 3].map(() => new Term());
  for (let i = 0; i < terms?.length; i++) {
    defaultValue[i] = { ...terms[i] };
  }
  return defaultValue;
};

const checkDuplicateProductSelection = (units: PurchaseUnit[]) => {
  const updateUnits = units ? [...units] : [];
  return updateUnits.map((u) => {
    const hasDuplicateSelected = hasDuplicateProductSelected(u.products);
    let updatedProduct = [];
    if (u.products.length > 0) {
      updatedProduct = u.products.map((p) => {
        const product = hasDuplicateSelected.find((dp) => dp.productId == p.productId);
        if (product && product?.productId == p.productId && !p.isSelected) {
          return Object.assign({}, p, { disable: true });
        }
        return Object.assign({}, p, { disable: false });
      });
    }
    return Object.assign({}, u, { products: updatedProduct });
  });
};

const reducer = createReducer(
  initialWorksheetState,
  on(WorksheetActions.getWorksheetDetailsSuccess, (state, { data }) => {
    let { units } = data;
    units = checkDuplicateProductSelection(units);
    return {
      ...state,
      currentChanges: { ...data, units, terms: initialTerms(data.terms), isDirty: false, isValid: true },
      previousChanges: { ...data, units, isDirty: false, isValid: true },
      loaded: true,
      dealerCostToggle: false,
    };
  }),
  on(WorksheetActions.updateFormStatus, (state, { data }) => {
    return {
      ...state,
      currentChanges: {
        ...state.currentChanges,
        ...data,
      },
    };
  }),
  on(WorksheetActions.updateTaxesSuccess, (state, { data }) => {
    return {
      ...state,
      currentChanges: {
        ...state.currentChanges,
        ...data,
      },
    };
  }),
  on(WorksheetActions.updatePurchaseUnitDetails, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { isValid, isDirty } = data;
    const unitIndex = units.findIndex((u) => u.id == data.id);
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: units.map((u, i) => {
          if (unitIndex == i) {
            return Object.assign({}, u, { ...data });
          }
          return u;
        }),
        isDirty,
        isValid,
      },
    };
  }),
  on(WorksheetActions.updateTradeInDetails, (state, { data }) => {
    const { currentChanges } = state;
    const { tradeIns } = currentChanges;
    const { isValid, isDirty } = data;
    const tradeInIndex = tradeIns.findIndex((t) => t.id == data.id);
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        tradeIns: tradeIns.map((t, i) => {
          if (tradeInIndex == i) {
            return Object.assign({}, t, { ...data });
          }
          return t;
        }),
        isDirty,
        isValid,
      },
    };
  }),
  on(WorksheetActions.updateOtherPayments, (state, { data }) => {
    const { isValid, isDirty } = data;
    const { currentChanges } = state;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        ...data,
        isDirty,
        isValid,

      },
    };
  }),

  on(WorksheetActions.updateTaxDetails, (state, { data }) => {
    const { currentChanges } = state;
    const payload = currentChanges.units.map((x) => (x.id === data.id ? data : x));
    const modifiedData = {
      ...currentChanges,
      units: payload,
    };

    return {
      ...state,
      currentChanges: { ...modifiedData },
    };
  }),

  on(WorksheetActions.salesOtherTaxes, (state, { data }) => {
    const { currentChanges } = state;
    const payload = currentChanges?.taxes?.map((_x) => data);
    currentChanges.taxes = [...payload];

    return {
      ...state,
      currentChanges: { ...currentChanges },
    };
  }),

  on(WorksheetActions.updateFinanceTerms, (state, { data }) => {
    const { currentChanges } = state;
    return {
      ...state,
      currentChanges: { ...currentChanges, ...data },
    };
  }),

  on(WorksheetActions.setActiveProductId, (state, { data }) => {
    return {
      ...state,
      activeUnitProductId: data,
    };
  }),

  on(WorksheetActions.calculateWorksheetDetailsSuccess, (state, { data }) => {
    const { currentChanges, dealerCostToggle } = state;
    let { units } = data;
    units = checkDuplicateProductSelection(units);

    const hasFinanceProducts = currentChanges?.products.length > 0;
    const hasProtectionProducts = currentChanges?.units.some((u) => u.products.length > 0);
    return {
      ...state,
      currentChanges: { ...data, units, terms: initialTerms(data.terms), isDirty: data.save ? false : data.isDirty },
      previousChanges: data.save ? { ...data, units } : state.previousChanges,
      dealerCostToggle: !hasFinanceProducts && !hasProtectionProducts ? false : dealerCostToggle,
    };
  }),
  on(WorksheetActions.updateProtectionProducts, (state, { data }) => {
    const { products, unitIndex, isValid, isDirty } = data;
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
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        ...updatedProps,
        isValid,
        isDirty,
      },
    };
  }),
  on(WorksheetActions.deleteProtectionProductSuccess, (state, { data }) => {
    return {
      ...state,
      currentChanges: data,
    };
  }),
  on(WorksheetActions.updateProductSelectionToggle, (state) => {
    const { currentChanges } = state;
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

    const hasCustomerSelection = allProducts.some((p) => p.isSelected);

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        disableIncludeSelectedProductsOnly: hasCustomerSelection,
      },
    };
  }),
  on(WorksheetActions.resetRatingProductsSuccess, (state, { data }) => {
    if (data) return state;
    const { currentChanges, previousChanges } = state;
    const { totalDownPayment } = previousChanges;
    const { units } = currentChanges;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        products: [],
        units: units.map((u) => {
          return Object.assign({}, u, { products: [] });
        }),
        totalDownPayment,
      },
      dealerCostToggle: false,
    };
  }),
  on(WorksheetActions.worksheetTab, (state, { data }) => {
    return {
      ...state,
      currentTab: data,
    };
  }),
  on(WorksheetActions.showRateProduct, (state, { data }) => ({
    ...state,
    ratingDialog: true,
    present: data,
  })),
  on(WorksheetActions.hideRateProduct, (state, { data }) => ({
    ...state,
    ratingDialog: false,
    present: data,
  })),
  on(WorksheetActions.updateDeliveryDate, (state, { data }) => {
    const { currentChanges } = state;
    return {
      ...state,
      currentChanges: { ...currentChanges, deliveryDate: data },
    };
  }),

  on(WorksheetActions.updateDealType, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    let modifiedUnits = [];
    if (data.dealType === DealType.Cash) {
      modifiedUnits = units.map((unit) => {
        const updatedProduct = unit.products.filter((product) => product.category !== ProductCategory.GAP);
        return Object.assign({}, unit, { products: updatedProduct });
      });
    }
    if (modifiedUnits.length > 0) currentChanges.units = modifiedUnits;
    return {
      ...state,
      currentChanges: { ...currentChanges, ...data },
    };
  }),
  on(WorksheetActions.loadWorksheetDetails, (state) => ({
    ...state,
    loaded: false,
  })),
  on(WorksheetActions.resetTabEvent, (state) => {
    return {
      ...state,
      currentChanges: {
        ...state.previousChanges,
        terms: initialTerms(state.previousChanges.terms),
      },
      dealerCostToggle: false,
    };
  }),
  on(WorksheetActions.getActiveUnitSuccess, (state, { data }) => ({
    ...state,
    activeUnitIndex: data,
  })),
  on(WorksheetActions.dealerCostToggle, (state, { data }) => ({
    ...state,
    dealerCostToggle: data,
  })),
  on(WorksheetActions.resetEvent, () => {
    return Object.assign({}, initialWorksheetState);
  }),
  on(WorksheetActions.resetUnit, (state, { data }) => {
    const { previousChanges } = state;
    const { units } = previousChanges;
    const unitIndex = units.findIndex((u) => u.id == data);
    const previousUnitData = units[unitIndex];
    return {
      ...state,
      currentChanges: {
        ...state.currentChanges,
        units: units.map((u, i) => {
          if (unitIndex == i) {
            return Object.assign({}, u, { ...previousUnitData });
          }
          return u;
        }),
        isDirty: false,
      },
    };
  }),
  on(WorksheetActions.resetWorksheetChanges, (state) => {
    const { previousChanges } = state;
    const { taxes } = previousChanges;
    return {
      ...state,
      currentChanges: {
        ...state.previousChanges,
        taxes: [...taxes],
        isDirty: false,
      },
    };
  }),
  on(WorksheetActions.updateTaxProfileType, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const updatedUnits = units.map(unit => {
      const matchingUnit =  data.id === unit.id;
      if (matchingUnit) {
        return { ...unit, ...data };
      }
      return unit;
    });
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: updatedUnits,
      }
    };
  }),
);

export function worksheetReducer(state: WorksheetState | undefined, action: Action) {
  return reducer(state, action);
}
