import { createSelector } from '@ngrx/store';
import { CustomerTab, DealType, DealWatermarkState, FormStatus } from '@app/entities';
import { DealTabPath } from '../../enum';
import { DealOverview } from '../../models';
import { State } from '../deal.state';
import { CommonState } from '../reducers';
import { getDealState } from './root.selector';

export const commonSelector = createSelector(getDealState, (state: State) => state.common);

const loaded = createSelector(commonSelector, (state: CommonState) => state.loaded);

export const currentTab = createSelector(commonSelector, (state: CommonState) => state.currentTab);
export const dealOverview = createSelector(commonSelector, (state: CommonState) => state.dealOverview);
export const isDealTypeChange = createSelector(commonSelector, (state: CommonState) => state.isDealTypeChanged);

export const dealId = createSelector(dealOverview, (dealOverview) => dealOverview.id);
export const deliveryDate = createSelector(dealOverview, (dealOverview) => dealOverview.deliveryDate);


export const currentTabInvalid = createSelector(getDealState, commonSelector, (state: State, commonState: CommonState) => {
  switch (commonState.currentTab) {
  case DealTabPath.Customer: {
    const { customer, tradeIn } = state;
    let currentChanges: FormStatus;
    if (customer.currentTab == CustomerTab.TradeIn) {
      currentChanges = tradeIn.currentChanges;
    } else {
      currentChanges = customer.currentChanges;
    }

    const { isValid } = currentChanges;
    return isValid;
  }

  case DealTabPath.Units: {
    const { currentChanges } = state.units;
    const { units } = currentChanges;
    const unitFormInvalid = units.isValid;
    return unitFormInvalid;
  }

  case DealTabPath.Worksheet: {
    const { currentChanges } = state.worksheet;
    return currentChanges?.isValid;
  }

  case DealTabPath.Lenders: {
    const { lenderDetails } = state.lender;
    return lenderDetails?.isValid;
  }

  default:
    return false;
  }
});

export const currentTabDirty = createSelector(getDealState, commonSelector, (state: State, commonState: CommonState) => {
  switch (commonState.currentTab) {
  case DealTabPath.Customer: {
    const { customer, tradeIn } = state;
    let currentChanges: FormStatus;
    if (customer.currentTab == CustomerTab.TradeIn) {
      currentChanges = tradeIn.currentChanges;
    } else {
      currentChanges = customer.currentChanges;
    }
    const { isDirty } = currentChanges;
    return isDirty;
  }

  case DealTabPath.Units: {
    const { currentChanges } = state.units;
    const { units } = currentChanges;
    const unitFormDirty = units.isDirty;
    return unitFormDirty;
  }

  case DealTabPath.Worksheet: {
    const { currentChanges } = state.worksheet;
    return currentChanges?.isDirty;
  }

  case DealTabPath.Lenders: {
    const { lenderDetails } = state.lender;
    return lenderDetails?.isDirty;
  }

  default:
    return false;
  }
});

export const currentTabLock = createSelector(currentTab, dealOverview, (currentTab, dealOverview: DealOverview) => {
  switch (currentTab) {
  case DealTabPath.Customer: {
    const { isCustomerLocked, isLocked } = dealOverview;
    return isCustomerLocked || isLocked;
  }
  case DealTabPath.Lenders: {
    const { isLenderLocked, isLocked } = dealOverview;
    return isLenderLocked || isLocked;
  }
  case DealTabPath.Units: {
    const { isUnitLocked, isLocked } = dealOverview;
    return isUnitLocked || isLocked;
  }

  case DealTabPath.Worksheet: {
    const { isWorksheetLocked, isLocked } = dealOverview;
    return isWorksheetLocked || isLocked;
  }

  default:
    return false;
  }
});

export const isLocked = createSelector(currentTab, dealOverview, (currentTab, dealOverview) => {
  const { isLocked, dealType, isLenderLocked } = dealOverview;

  if (currentTab === DealTabPath.Lenders) {
    return isLocked || isLenderLocked || dealType === DealType.Cash;
  }

  return isLocked;
});

export const isDealInActive = createSelector(dealOverview, (dealOverview) => {
  const { state } = dealOverview;
  const isActive = state === DealWatermarkState.Inactive || state === DealWatermarkState.Closed || state === DealWatermarkState.Blocked;
  return isActive;
});

export const dmsImported = createSelector(dealOverview, (dealOverview) => {
  const { imported } = dealOverview;
  return imported;
});

export const dealDetails = createSelector(dealOverview, (dealOverview) => {
  const { creditApplicationId, id, customerName } = dealOverview;
  return { creditApplicationId, id, customerName };
});

export const isWorksheetLocked = createSelector(dealOverview, (dealOverview: DealOverview) => {
  const { isWorksheetLocked, isLocked } = dealOverview;
  return isWorksheetLocked || isLocked;
});

export const isPartAccessoriesLocked = createSelector(dealOverview, (dealOverview: DealOverview) => {
  const { isPartAccessoriesLocked, isLocked } = dealOverview;
  return isPartAccessoriesLocked || isLocked;
});

export const isContractGenerated = createSelector(dealOverview, (dealOverview: DealOverview) => {
  const { isCustomerLocked, isLocked } = dealOverview;
  return isCustomerLocked || isLocked;
});
export const lenderState = createSelector(getDealState, (state: State) => state.lender);

export const docsState = createSelector(getDealState, (state: State) => state.docs);

export const dealLayoutViewModel = createSelector(
  loaded,
  currentTab,
  dealOverview,
  lenderState,
  (loaded, currentTab, dealOverview, lenderState) => {
    const { state, dealType, lenderName } = dealOverview;
    const { lenders } = lenderState;
    const isLenderSelected = lenders?.some((lender) => lender.isSelected);
    let updatedLenderName;
    if (dealType === DealType.Cash) updatedLenderName = '';
    if (isLenderSelected) updatedLenderName = lenderName;
    const watermark = state === DealWatermarkState.Inactive || state === DealWatermarkState.Closed ? state : null;

    return { loaded, currentTab, dealOverview: { ...dealOverview, lenderName: updatedLenderName }, watermark, currentTabLock, isPartAccessoriesLocked, dmsImported };
  }
);

export const hasCustomerAddress = createSelector(getDealState, (state: State) => {
  const { customer } = state;
  const { currentChanges } = customer;
  const { primaryCustomer } = currentChanges;
  return !!primaryCustomer.currentAddress?.state;
});

export const primaryCustomerAddress = createSelector(getDealState, (state: State) => {
  const { customer } = state;
  const { currentChanges } = customer;
  const { primaryCustomer } = currentChanges;
  return primaryCustomer.currentAddress;
});

export const customerInformation = createSelector(getDealState, (state: State) => {
  const { customer } = state;
  const { currentChanges } = customer;
  const { primaryCustomer, secondaryCustomer, customerType } = currentChanges;

  return {
    primaryCustomer: primaryCustomer,
    secondaryCustomer: secondaryCustomer,
    customerType: customerType,
  };
});
