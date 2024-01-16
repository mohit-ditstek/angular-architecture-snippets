import { createSelector } from '@ngrx/store';
import { ComponentTypeLabel, FinanceTerm, OtherPayments, ProductCategory, TaxJurisdiction } from '@app/entities';
import { State } from '../deal.state';
import { WorksheetState } from '../reducers';
import { getDealState } from './root.selector';

export const worksheetSelector = createSelector(getDealState, (state: State) => state.worksheet);

export const dataLoaded = createSelector(worksheetSelector, (state: WorksheetState) => state.loaded);

export const currentWorksheetTab = createSelector(worksheetSelector, (state: WorksheetState) => state.currentTab);
export const workSheetDetails = createSelector(worksheetSelector, (state: WorksheetState) => state.currentChanges);
export const dealerCostToggle = createSelector(worksheetSelector, (state: WorksheetState) => state.dealerCostToggle);
export const activeUnitIndex = createSelector(worksheetSelector, (state: WorksheetState) => state.activeUnitIndex);
export const setActiveProductId = createSelector(worksheetSelector, (state: WorksheetState) => state.activeUnitProductId);

export const isDealTypeChanged = createSelector(worksheetSelector, (state: WorksheetState) => {
  const { currentChanges, previousChanges } = state;
  const currentDealType = currentChanges?.dealType;
  const previousDealType = previousChanges?.dealType;
  return currentDealType !== previousDealType;
});

export const purchasedUnits = createSelector(workSheetDetails, (workSheetDetails) => {
  if (!workSheetDetails) return null;
  const { units } = workSheetDetails;
  return units;
});

export const activePurchaseUnit = createSelector(purchasedUnits, activeUnitIndex, (purchasedUnits, activeUnitIndex) => {
  let activeUnit = purchasedUnits[activeUnitIndex];
  const isTaxJurisdictionOutOfState = activeUnit
    ? activeUnit.taxes?.some((x) => x.rates.length === 0 && x.jurisdictionType === TaxJurisdiction.Customer && x.isTaxed === true && !x.isSameAsUnit)
    : false;
  activeUnit = { ...activeUnit, isTaxJurisdictionOutOfState };
  return activeUnit;
});

export const showRatingDialog = createSelector(worksheetSelector, (state: WorksheetState) => {
  return { present: state.present, ratingDialog: state.ratingDialog };
});

export const worksheetViewModel = createSelector(dataLoaded, workSheetDetails, currentWorksheetTab, (loaded, workSheetDetails, currentWorksheetTab) => {
  const { units } = workSheetDetails;
  const hasRatedGapProduct = units.some((u) => u.products.some((p) => p.category === ProductCategory.GAP));
  return { loaded, workSheetDetails, currentWorksheetTab, hasRatedGapProduct };
});

export const totalTaxAmount = createSelector(activePurchaseUnit, (activePurchaseUnit) => activePurchaseUnit.vehicleTax);
export const totalTaxableAmount = createSelector(activePurchaseUnit, (activePurchaseUnit) => activePurchaseUnit.totalTaxableAmount);
export const unitTaxableAmount = createSelector(
  activePurchaseUnit,
  (activePurchaseUnit) => activePurchaseUnit.taxes.find((tax) => tax.componentTypeLabel === ComponentTypeLabel.SellingPrice)?.totalTaxableAmount
);

export const unitTaxAmount = createSelector(
  activePurchaseUnit,
  (activePurchaseUnit) => activePurchaseUnit.taxes.find((tax) => tax.componentTypeLabel === ComponentTypeLabel.SellingPrice)?.totalAmount
);

export const salesOtherTaxAmount = createSelector(
  workSheetDetails,
  (workSheetDetails) => workSheetDetails.taxes.find((tax) => tax.componentTypeLabel === ComponentTypeLabel.NonInstalledPartsAccessories)?.totalRate
);
export const salesOtherTaxableAmount = createSelector(
  workSheetDetails,
  (workSheetDetails) => workSheetDetails.taxes.find((tax) => tax.componentTypeLabel === ComponentTypeLabel.NonInstalledPartsAccessories)?.totalAmount
);

export const protectionProductTaxAmount = createSelector(setActiveProductId, workSheetDetails, (setActiveProductId, workSheetDetails) => {
  let taxAmount: number;
  const { units, products } = workSheetDetails;
  //  units products taxAmount
  units.forEach((unit) => {
    const product = unit.products.find((products) => products.id === setActiveProductId);
    if (product) taxAmount = product.tax.totalRate;
  });
  //finance products taxAmount
  if (!taxAmount) taxAmount = (products || []).find((products) => products.id === setActiveProductId)?.tax?.totalRate;

  return taxAmount;
});

export const protectionProductTaxableAmount = createSelector(setActiveProductId, workSheetDetails, (setActiveProductId, workSheetDetails) => {
  let taxableAmount: number;
  const { units, products } = workSheetDetails;
  //  units products totalAmount
  units.map((unit) => {
    const product = unit.products.find((products) => products.id === setActiveProductId);
    if (product) taxableAmount = product.tax.totalAmount;
  });
  //finance products totalAmount
  if (!taxableAmount) taxableAmount = (products || []).find((products) => products.id === setActiveProductId)?.tax?.totalAmount;
  return taxableAmount || 0;
});

export const purchaseUnitsViewModel = createSelector(workSheetDetails, activePurchaseUnit, (workSheetDetails, activePurchaseUnit) => {
  if (!workSheetDetails) return null;
  const { units, dealType, isCommonUseTaxes} = workSheetDetails;
  const index = workSheetDetails?.units.findIndex((u) => u.id == activePurchaseUnit.id);
  const { vehicleTax, totalTaxableAmount } = activePurchaseUnit;
  const activeTaxProfileOptions = (activePurchaseUnit?.taxProfiles || []).map((profile) => ({ text: profile.name, value: profile.id }));
  return { purchaseUnits: units, dealType: dealType, isCommonUseTaxes: isCommonUseTaxes, activeUnit: activePurchaseUnit, activeTaxProfileOptions, vehicleTax, totalTaxableAmount, index };
});

export const paymentTerm = createSelector(workSheetDetails, (workSheetDetails) => {
  const { term, interestRate, netPurchase } = workSheetDetails || {};
  return { term: term, interestRate: interestRate, netPurchase: netPurchase };
});

export const tradeInsViewModel = createSelector(workSheetDetails, (workSheetDetails) => {
  const { tradeIns, totalNetTradeIn } = workSheetDetails;
  return { tradeIns, totalNetTradeIn };
});

export const otherPaymentViewModel = createSelector(dataLoaded, workSheetDetails, (loaded, workSheetDetails) => {
  const {
    salesOtherTax,
    totalDownPayment,
    totalCashDown,
    isTotalCashDownOverridden,
    totalNonInstalledPartsAccessoriesLabor,
    overrideTotalNonInstalledPartsAccessoriesLabor,
    totalNonInstalledPartsAccessoriesLaborCalculated,
    totalOther,
    totalDown,
    taxes,
    taxJurisdiction,
    isSalesOtherTaxOverridden,
    tradeIns,
    totalNetTradeIn,
    deposits,
    isCommonUseTaxes,
  } = workSheetDetails;
  const details = {
    salesOtherTax,
    totalDownPayment,
    totalCashDown,
    isTotalCashDownOverridden,
    totalNonInstalledPartsAccessoriesLabor,
    overrideTotalNonInstalledPartsAccessoriesLabor,
    totalNonInstalledPartsAccessoriesLaborCalculated,
    totalDown,
    totalOther,
    taxes,
    taxJurisdiction,
    isSalesOtherTaxOverridden,
    deposits,
    isCommonUseTaxes,
    isTaxJurisdictionOutOfState: taxes.some((t) => t.jurisdictionType === TaxJurisdiction.Customer),
  } as OtherPayments;

  return { loaded, details, tradeIns, totalNetTradeIn };
});

export const financeTermViewModel = createSelector(dataLoaded, workSheetDetails, (loaded, workSheetDetails) => {
  const { deliveryDate, terms, daysToFirstPayment, termFrequency, dealType, firstPaymentDate, lastPaymentDate, units, financeReserveAmount } = workSheetDetails;
  const hasRatedGapProduct = units.some((u) => u.products.some((p) => p.category === 'GAP'));
  const finaceTermDetails = {
    deliveryDate,
    terms,
    daysToFirstPayment,
    dealType,
    termFrequency,
    hasRatedGapProduct,
  } as FinanceTerm;
  return { loaded, finaceTermDetails, firstPaymentDate, lastPaymentDate,financeReserveAmount };
});

export const hasCustomerJurisdictionType = createSelector(workSheetDetails, (workSheetDetails) => {
  const { units, taxes } = workSheetDetails;
  const isCustomerTaxes = taxes.some((t) => t.jurisdictionType === TaxJurisdiction.Customer);
  const isCustomerTaxesInUnit = units.some((unit) => unit.taxes.some((t) => t.jurisdictionType === TaxJurisdiction.Customer));
  const isCustomerTaxesInUnitProducts = units.some((unit) => unit.products.some((product) => product.tax.jurisdictionType === TaxJurisdiction.Customer));

  return isCustomerTaxes || isCustomerTaxesInUnit || isCustomerTaxesInUnitProducts;
});
