import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import {
  DealType,
  DealTypeChange,
  DeductibleType,
  FinanceTerm,
  FormStatus,
  OtherPayments,
  PurchaseUnit,
  RatedProduct,
  TaxProfileChange,
  TradeInDetails,
  WorksheetDetails,
  WorksheetTab,
} from '@app/entities';
import * as WorksheetActions from '../actions';
import { WorksheetFacade } from './worksheet.facade';

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
    deductibleType: DeductibleType.Normal
  },
];

const purchagesUnits: PurchaseUnit[] = [
  {
    id: 1,
    label: '',
    sellingPrice: 1122,
    freight: 123,
    dealerPrep: 132,
    totalSellingPrice: 32141,
    products: product,
    isDirty: false,
    totalFees: 123,
    totalRebates: 987,
    vehicleTax: 788,
    isValid: true,
    fees: [],
    taxes: [],
    isProductPresentationCompleted: false,
    isProductSelected: false,
    isAnyProductSelectionDisabled: false,
    totalComponentsSellingPrice: 0,
    unitImportId: '',
  },
  {
    id: 2,
    label: '',
    sellingPrice: 1122,
    freight: 123,
    fees: [],
    taxes: [],
    totalRebates: 987,
    dealerPrep: 132,
    totalSellingPrice: 32141,
    products: product,
    totalFees: 123,
    vehicleTax: 988,
    components: null,
    isDirty: false,
    isValid: true,
    isProductPresentationCompleted: false,
    isProductSelected: false,
    isAnyProductSelectionDisabled: false,
    totalComponentsSellingPrice: 0,
    unitImportId: '',
  },
];
const tradeInDetails: TradeInDetails[] = [
  {
    id: 1,
    label: '',
    allowance: 2,
    payoff: 3,
    netTradeIn: 2,
    isDirty: false,
    isValid: true,
    isTaxCredit: false,
  },
];

const financeTerm: FinanceTerm[] = [
  {
    deliveryDate: new Date(),
    terms: [],
    daysToFirstPayment: 1,
    dealType: DealType.Cash,
    termFrequency: 0,
    interestRate: 1,
    termsChanged: true,
    isDirty: false,
    isValid: false,
  },
];

const otherPayments: OtherPayments = {
  salesOtherTax: 23,
  totalFees: 2,
  totalDownPayment: 2,
  totalOther: 2,
  totalDown: 2,
  overrideTotalNonInstalledPartsAccessoriesLabor: true,
  totalNonInstalledPartsAccessoriesLabor: 1,
  totalNonInstalledPartsAccessoriesLaborCalculated: 1,
  isDirty: false,
  isValid: false,
  taxes: null,
  deposits: []
};
const purchaseUnit: PurchaseUnit = {
  id: 10,
  label: 'Module',
  sellingPrice: 230,
  freight: 30,
  dealerPrep: 450,
  totalFees: 60,
  products: [],
  isProductPresentationCompleted: false,
  isProductSelected: false,
  isAnyProductSelectionDisabled: false,
  totalComponentsSellingPrice: 70,
  unitImportId: '234',
  isDirty: false,
  isValid: false,
  fees: [],
  taxes: [],
};
const worksheetDetails: WorksheetDetails = {
  units: purchagesUnits,
  term: 0,
  tradeIns: tradeInDetails,
  dealType: 0,
  isDealTypeModified: false,
  totalNetTradeIn: 0,
  salesOtherTax: 0,
  totalFees: 0,
  totalDownPayment: 0,
  totalRebates: 0,
  netPurchase: 0,
  totalSelectedProducts: 0,
  totalDealAmount: 0,
  deliveryDate: new Date(),
  terms: [],
  termFrequency: 0,
  interestRate: 0,
  daysToFirstPayment: 0,
  firstPaymentDate: new Date(),
  lastPaymentDate: new Date(),
  totalAmountFinanced: 0,
  payment: 0,
  products: [],
  isDirty: false,
  isValid: false,
  totalNonInstalledPartsAccessoriesLabor: 0,
  totalNonInstalledPartsAccessoriesLaborCalculated: 0,
  overrideTotalNonInstalledPartsAccessoriesLabor: false,
  includeSelectedProductsOnly: false,
  disableIncludeSelectedProductsOnly: false,
  totalDown: 0,
  totalOther: 0,
  totalPurchasePrice: 0,
  totalUnitsPurchasePrice: 0,
  totalUnitsRebates: 0,
  totalUnitsFreightPrepHandling: 0,
  totalCashDown: 0,
  deposits: []
};
describe('Worksheet Facade', () => {
  let facade: WorksheetFacade;
  let store: Store;
  let dispatchSpy;

  describe('Worksheet Facade', () => {
    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
        providers: [WorksheetFacade],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] });
      store = TestBed.inject(Store);
      facade = TestBed.inject(WorksheetFacade);
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
      expect(store).toBeTruthy();
    });

    it('should handle calculateWorksheetDetails action', async () => {
      const payload = true;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.calculateWorksheetDetails(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });

    it('should handle getWorksheetDetails action', async () => {
      const payload = true;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getWorksheetDetails(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });
    it('should handle getWorksheetDetailsSuccess action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getWorksheetDetailsSuccess(worksheetDetails);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.getWorksheetDetailsSuccess({ data: worksheetDetails }));
    });
    it('should handle updatePurchaseUnitDetails action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updatePurchaseUnitDetails(purchagesUnits[0]);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updatePurchaseUnitDetails({ data: purchagesUnits[0] }));
    });

    it('should handle updateTaxDetails action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTaxDetails(purchagesUnits[0]);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTaxDetails({ data: purchagesUnits[0] }));
    });

    it('should handle salesOtherTaxes action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.salesOtherTaxes(null);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.salesOtherTaxes({ data: null }));
    });

    it('should handle updateTaxProfileType action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTaxProfileType(null);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTaxProfileType({ data: null }));
    });

    it('should handle dealerCostToggle action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dealerCostToggle(false);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.dealerCostToggle({ data: false }));
    });

    it('should handle resetWorksheetChanges action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetWorksheetChanges();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.resetWorksheetChanges());
    });

    it('should handle getActiveUnit action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getActiveUnit();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.getActiveUnit());
    });

    it('should handle updateTradeInDetails action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTradeInDetails(tradeInDetails[0]);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTradeInDetails({ data: tradeInDetails[0] }));
    });

    it('should handle updateFinanceTerms action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateFinanceTerms(financeTerm[0]);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateFinanceTerms({ data: financeTerm[0] }));
    });

    it('should handle updateOtherPayments action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateOtherPayments(otherPayments);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateOtherPayments({ data: otherPayments }));
    });
    it('should handle updateTaxDetails action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTaxDetails(purchaseUnit);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTaxDetails({ data: purchaseUnit }));
    });
    it('should handle updateProtectionProducts action', async () => {
      const payload = { products: product, unitIndex: 1, isValid: true, isDirty: false };
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateProtectionProducts(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateProtectionProducts({ data: payload }));
    });

    it('should handle updateFormStatus action', async () => {
      const payload = new FormStatus();
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateFormStatus(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateFormStatus({ data: payload }));
    });

    it('should handle updateProductSelectionToggle action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateProductSelectionToggle();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateProductSelectionToggle());
    });
    it('should handle showRateProduct action', async () => {
      const payload = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.showRateProduct(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.showRateProduct({ data: payload }));
    });

    it('should handle hideRateProduct action', async () => {
      const payload = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.hideRateProduct(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.hideRateProduct({ data: payload }));
    });

    it('should handle resetRatingProducts action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetRatingProducts(false);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.resetRatingProducts({data:false}));
    });

    it('should handle resetRatingProductsSuccess action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetRatingProductsSuccess();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.resetRatingProductsSuccess({data: false}));
    });

    it('should handle updateTabLocks action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTabLocks();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTabLocks());
    });

    it('should handle updateDeliveryDate action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      const payload = new Date();
      facade.updateDeliveryDate(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateDeliveryDate({ data: payload }));
    });
    it('should handle updateDealType action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      const payload: DealTypeChange = {
        dealType: DealType.Cash,
        isDirty: false,
        isValid: false,
      };
      facade.updateDealType(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateDealType({ data: payload }));
    });
    it('should handle dealerCostToggle action', async () => {
      const payload = true;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dealerCostToggle(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });
    it('should handle updateTaxProfileType action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      const payload: TaxProfileChange = {
        taxProfileId: 230,
        isDirty: false,
        isValid: false,
      };
      facade.updateTaxProfileType(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.updateTaxProfileType({ data: payload }));
    });
    it('should handle worksheetTab action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.worksheetTab(WorksheetTab.PurchaseUnit);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.worksheetTab({ data: WorksheetTab.PurchaseUnit }));
    });
    it('should handle getActiveUnit action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getActiveUnit();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(WorksheetActions.getActiveUnit());
    });
    it('should handle hideRateProduct action', async () => {
      const payload = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.hideRateProduct(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });
  
    it('should handle resetUnit action', async () => {
      const payload = 234;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetUnit(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });
    it('should handle setActiveProductId action', async () => {
      const payload = 234;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.setActiveProductId(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
    });
  });
});
