import * as WorksheetSelector from './worksheet.selectors';
import { PurchaseUnits, WorksheetData } from '../../testing';
import { WorksheetState } from '../reducers';
import { WorksheetTab } from '@app/entities';

const worksheetState: WorksheetState = {
  loaded: false,
  currentTab: WorksheetTab.PurchaseUnit,
  present: false,
  ratingDialog: false,
  currentChanges: WorksheetData,
  previousChanges: WorksheetData,
  dealerCostToggle: false,
  activeUnitIndex: 0,
  activeUnitProductId: 0,
};
describe('Dealer Worksheet Selectors', () => {
  it('should return dataLoaded selector', () => {
    const result = WorksheetSelector.dataLoaded.projector(worksheetState);
    expect(result).toEqual(false);
  });
  it('should return currentWorksheetTab selector', () => {
    const result = WorksheetSelector.currentWorksheetTab.projector(worksheetState);
    expect(result).toEqual(WorksheetTab.PurchaseUnit);
  });
  it('should return workSheetDetails selector', () => {
    const result = WorksheetSelector.workSheetDetails.projector(worksheetState);
    expect(result).not.toBeNull();
  });
  it('should return dealerCostToggle selector', () => {
    const result = WorksheetSelector.dealerCostToggle.projector(worksheetState);
    expect(result).toEqual(false);
  });
  it('should return activeUnitIndex selector', () => {
    const result = WorksheetSelector.activeUnitIndex.projector(worksheetState);
    expect(result).toEqual(0);
  });

  it('should return setActiveProductId selector', () => {
    const result = WorksheetSelector.setActiveProductId.projector(worksheetState);
    expect(result).toEqual(0);
  });
  describe('purchaseUnits', () => {
    it('should return the units from workSheetDetails', () => {
      const result = WorksheetSelector.purchasedUnits.projector(WorksheetData);
      expect(result).toEqual(WorksheetData.units);
    });

    it('should return null if workSheetDetails is not provided', () => {
      const workSheetDetails = null;
      const result = WorksheetSelector.purchasedUnits.projector(workSheetDetails);
      expect(result).toBeNull();
    });
  });

  it('should return the activePurchaseUnit selector', () => {
    const result = WorksheetSelector.activePurchaseUnit.projector(WorksheetData.units, 0);
    expect(result).not.toBeUndefined();
  });
  it('should return the worksheetViewModel selector', () => {
    const result = WorksheetSelector.worksheetViewModel.projector(true, WorksheetData, WorksheetTab.PurchaseUnit);
    expect(result.loaded).toBeTruthy();
    expect(result.workSheetDetails).not.toBeNull();
    expect(result.currentWorksheetTab).toBe(WorksheetTab.PurchaseUnit);
  });
  it('should return the showRatingDialog selector', () => {
    const result = WorksheetSelector.showRatingDialog.projector(worksheetState);
    expect(result.present).toBeFalsy();
    expect(result.ratingDialog).toBeFalsy();
  });

  it('should return the protectionProductTaxAmount selector', () => {
    const result = WorksheetSelector.protectionProductTaxAmount.projector(121, WorksheetData);
    expect(result).toBe(0);
  });
  it('should return the protectionProductTaxableAmount selector', () => {
    const result = WorksheetSelector.protectionProductTaxableAmount.projector(121, WorksheetData);
    expect(result).toBe(0);
  });

  describe('purchaseUnitsViewModel', () => {
    const activeUnit = WorksheetData.units[0];
    it('should return the purchase units viewModel selector', () => {
      const result = WorksheetSelector.purchaseUnitsViewModel.projector(WorksheetData, activeUnit);
      expect(result).not.toBeNull();
    });

    it('should return an empty object when workSheetDetails is not provided', () => {
      const workSheetDetails = null;
      const result = WorksheetSelector.purchaseUnitsViewModel.projector(workSheetDetails, activeUnit);
      expect(result).toBeNull();
    });
  });

  describe('paymentTerm', () => {
    it('should return the payment term details when workSheetDetails is provided', () => {
      const result = WorksheetSelector.paymentTerm.projector(WorksheetData);
      expect(result).toEqual({
        term: 40,
        interestRate: 20,
        netPurchase: 20,
      });
    });

    it('should return an empty object when workSheetDetails is not provided', () => {
      const workSheetDetails = null;
      const result = WorksheetSelector.paymentTerm.projector(workSheetDetails);
      expect(result).toEqual({});
    });
  });
  it('should return the tradeInsViewModel selector', () => {
    const result = WorksheetSelector.tradeInsViewModel.projector(WorksheetData);
    expect(result.totalNetTradeIn).toEqual(123);
    expect(result.tradeIns.length).toBe(1);
  });
  it('should return the otherPaymentViewModel selector', () => {
    const result = WorksheetSelector.otherPaymentViewModel.projector(true, WorksheetData);
    expect(result.loaded).toEqual(true);
    expect(result.tradeIns.length).toBe(1);
    expect(result.totalNetTradeIn).toEqual(123);
  });
  it('should return the financeTermViewModel selector', () => {
    const result = WorksheetSelector.financeTermViewModel.projector(true, WorksheetData);
    expect(result.loaded).toEqual(true);
    expect(result.firstPaymentDate).not.toBeUndefined();
    expect(result.lastPaymentDate).not.toBeUndefined();
  });

  it('should return unitTotalTaxAmount', () => {
    const result = WorksheetSelector.unitTaxAmount.projector(PurchaseUnits[0]);
    expect(result).toBe(1200);
  });

  it('should return totalTaxAmount', () => {
    const result = WorksheetSelector.totalTaxAmount.projector(PurchaseUnits[0]);
    expect(result).toBe(1200);
  });
  it('should return totalTaxableAmount', () => {
    const result = WorksheetSelector.totalTaxableAmount.projector(PurchaseUnits[0]);
    expect(result).toBe(12000);
  });
  it('should return unitTaxableAmount', () => {
    const result = WorksheetSelector.unitTaxableAmount.projector(PurchaseUnits[0]);
    expect(result).toBe(12000);
  });
  it('should return unitTaxAmount', () => {
    const result = WorksheetSelector.unitTaxAmount.projector(PurchaseUnits[0]);
    expect(result).toBe(1200);
  });

  it('should return salesOtherTaxAmount', () => {
    const result = WorksheetSelector.salesOtherTaxAmount.projector(WorksheetData);
    expect(result).toBe(24);
  });

  it('should return salesOtherTaxableAmount', () => {
    const result = WorksheetSelector.salesOtherTaxableAmount.projector(WorksheetData);
    expect(result).toBe(1000);
  });

  it('should return hasCustomerJurisdictionType', () => {
    const result = WorksheetSelector.hasCustomerJurisdictionType.projector(WorksheetData);
    expect(result).toBe(true);
  });
  
});
