import { createAction, props } from '@ngrx/store';
import { ActionPayloadData, FormStatus, RatedProduct, WorksheetTab, DealTypeChange, FinanceTerm, OtherPayments, PurchaseUnit, SelectProduct, TaxProfileChange, ComponentTax, TradeInDetails, WorksheetDetails } from '@app/entities';

export const getWorksheetDetails = createAction('[Worksheet] Get Worksheet Details', props<ActionPayloadData<boolean>>());
export const getWorksheetDetailsSuccess = createAction('[Worksheet] Get Worksheet Details Success', props<ActionPayloadData<WorksheetDetails>>());
export const getWorksheetDetailsFailure = createAction('[Worksheet] Get Worksheet Details Failure');

export const updateTaxDetails = createAction('[Worksheet]Update Tax Details', props<ActionPayloadData<PurchaseUnit>>());
export const salesOtherTaxes = createAction('[Worksheet]Update Tax Details', props<ActionPayloadData<ComponentTax>>());

export const updateFormStatus = createAction('[Worksheet] Update Form Status', props<ActionPayloadData<FormStatus>>());
export const updatePurchaseUnitDetails = createAction('[Worksheet] Update Purchase Unit Details', props<ActionPayloadData<PurchaseUnit>>());
export const updateTradeInDetails = createAction('[Worksheet] Update Trade-In Details', props<ActionPayloadData<TradeInDetails>>());
export const updateFinanceTerms = createAction('[Worksheet] Update Finance Terms', props<ActionPayloadData<FinanceTerm>>());

export const updateProtectionProducts = createAction(
  '[Worksheet] Update Protection product',
  props<ActionPayloadData<{ products: RatedProduct[]; unitIndex: number; isValid: boolean; isDirty: boolean }>>()
);
export const updateOtherPayments = createAction('[Worksheet] Update Other Payments', props<ActionPayloadData<OtherPayments>>());
export const setActiveProductId = createAction('[Worksheet] Set Product ID Details', props<ActionPayloadData<number>>());

export const calculateWorksheetDetails = createAction('[Worksheet] Calculate Worksheet Details', props<ActionPayloadData<boolean>>());
export const calculateWorksheetDetailsSuccess = createAction('[Worksheet] Calculate Worksheet Details Success', props<ActionPayloadData<WorksheetDetails>>());
export const calculateWorksheetDetailsFailure = createAction('[Worksheet] Calculate Worksheet Details Failure');

export const deleteProtectionProduct = createAction('[Worksheet] Delete Protection Product', props<ActionPayloadData<SelectProduct>>());
export const deleteProtectionProductSuccess = createAction('[Worksheet] Delete Protection Product Success', props<ActionPayloadData<WorksheetDetails>>());

export const updateProductSelectionToggle = createAction('[Worksheet] Update Product Selection Toggle');

export const worksheetTab = createAction('[Worksheet] Worksheet Tab', props<ActionPayloadData<WorksheetTab>>());

export const showRateProduct = createAction('[Worksheet] Show Rate Product', props<ActionPayloadData<boolean>>());
export const hideRateProduct = createAction('[Worksheet] Hide Rate Product', props<ActionPayloadData<boolean>>());

export const resetRatingProducts = createAction('[Worksheet] Reset Rating Products', props<ActionPayloadData<boolean>>());
export const resetRatingProductsSuccess = createAction('[Worksheet] Reset Rating Products Success', props<ActionPayloadData<boolean>>());
export const resetRatingProductsFailure = createAction('[Worksheet] Reset Rating Products Failure');

export const updateDeliveryDate = createAction('[Worksheet] Update Delivery Date', props<ActionPayloadData<Date>>());
export const updateDealType = createAction('[Worksheet] Update Deal Type', props<ActionPayloadData<DealTypeChange>>());
export const updateTaxProfileType = createAction('[Worksheet] Update Tax Profile', props<ActionPayloadData<TaxProfileChange>>());
export const updateTabLocks = createAction('[Worksheet] Update Tab Locks');

export const loadWorksheetDetails = createAction('[Worksheet] Load Worksheet Details');

export const dealerCostToggle = createAction('[Worksheet] Dealer Cost Toggle', props<ActionPayloadData<boolean>>());

export const getActiveUnit = createAction('[Worksheet] Get Active Unit');
export const getActiveUnitSuccess = createAction('[Worksheet] Get Active Unit Success', props<ActionPayloadData<number>>());
export const resetUnit = createAction('[Deal] Reset Unit', props<ActionPayloadData<number>>());
export const resetWorksheetChanges = createAction('[Deal] Reset Worksheet Changes');

export const saveOnClose = createAction('[Worksheet] Save On Close', props<ActionPayloadData<boolean>>());

export const updateTaxesSuccess = createAction('[Worksheet] Update Taxes Success', props<ActionPayloadData<WorksheetDetails>>());

