import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { AppCategoryTaxes, CategoryTaxes, ComponentTax, DeductibleType, RatedProduct, TaxJurisdiction, TradeInDetails, WorksheetDetails } from '@app/entities';
import { MockTaxManagementFacade, TaxesData } from '@app/features/tax-profile/tax-profile-configuration';
import { EventService, LoaderService, MockEventService, MockLoaderService } from '@app/shared/services';
import { MockRouterService } from '@app/shared/testing';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { MockUserFacade, TaxFacade, UserFacade } from '@app/store/user';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { DealTabLocks } from '../../models';
import { WorksheetService } from '../../services';
import { MockDealFacade, MockWorkSheetFacade, MockWorksheetService, PurchaseUnits, TermData, WorksheetData } from '../../testing';
import * as WorksheetActions from '../actions';
import { DealFacade } from '../facades';
import { WorksheetFacade } from '../facades/worksheet.facade';
import { WorksheetEffects } from './worksheet.effects';

const componentDataTax: ComponentTax =
  {
    componentType: 11,
    componentTypeLabel: 'SellingPrice',
    description: 'make',
    isTaxed: true,
    taxType: 1,
    isSameAsUnit: false,
    isAmountOverridden: false,
    totalAmount: 0,
    jurisdictionType: TaxJurisdiction.Customer,
    totalRate: 0,
    totalTaxableAmount: 12,
    componentAmount: 34,
    isDirty: false,
    isValid: false,
    rates: [],
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
    deductibleType: DeductibleType.Normal,
    isTaxAmountOverridden: false,
    tax: componentDataTax
  },
];

const categoryData: CategoryTaxes = {
  salesTaxAuto: TaxesData,
  useTaxAuto: TaxesData,
  salesTaxGeneral: TaxesData,
  useTaxGeneral: TaxesData,
};

const mockAppTaxData: AppCategoryTaxes = {
  customer: categoryData,
  dealer: categoryData,
};
const worksheetData: WorksheetDetails = {
  dealType: 0,
  totalNetTradeIn: 123,
  includeSelectedProductsOnly: false,
  overrideTotalNonInstalledPartsAccessoriesLabor: true,
  totalNonInstalledPartsAccessoriesLabor: 220,
  totalNonInstalledPartsAccessoriesLaborCalculated: 200,
  totalFees: 110,
  totalDownPayment: 30,
  totalCashDown: 30,
  isTotalCashDownOverridden: true,
  totalRebates: 30,
  netPurchase: 20,
  totalDealAmount: 10,
  deliveryDate: new Date(),
  term: 40,
  terms: TermData,
  tradeIns: [
    {
      id: 0,
      label: '',
      allowance: 0,
      payoff: 0,
      netTradeIn: 0,
      isTaxCredit: false,
      isDirty: false,
      isValid: false,
    },
  ],
  taxes: [
    {
      componentType: 0,
      componentTypeLabel: 'Test',
      description: 'test',
      isTaxed: true,
      isSameAsUnit: false,
      isAmountOverridden: false,
      totalAmount: 1000,
      totalRate: 24,

      rates: [
        {
          label: 'test',
          rate: 200,
          isDisabled: true,
        },
      ],
      jurisdictionType: 1,
      taxType: 1,
      totalTaxableAmount: 522,
      isDirty: false,
      isValid: true,
    },
  ],
  termFrequency: 0,
  interestRate: 20,
  daysToFirstPayment: 30,
  firstPaymentDate: new Date(),
  lastPaymentDate: new Date(),
  totalAmountFinanced: 260,
  payment: 2200,
  units: PurchaseUnits,
  products: product,
  overrideTotalLabor: true,
  totalLabor: 5,
  totalLaborCalculated: 256,
  apr: 46,
  totalUnitsPrice: 758,
  totalUnitsTaxes: 848,
  totalUnitsFees: 949,
  netPurchasePayment: 6446,
  totalOther: 455,
  totalRatedProducts: 657,
  totalSelectedManualProducts: 899,
  totalSelectedProducts: 988,
  totalSelectedRatedProducts: 657,
  totalTaxes: 877,
  totalAllFees: 788,
  unitsSubTotal: 767,
  termsChanged: true,
  totalPartsAccessoriesLabor: 877,
  totalProducts: 988,
  totalUnitsSellingPrice: 877,
  salesOtherTax: 657,
  totalDown: 110,
  disableIncludeSelectedProductsOnly: false,
  isDealTypeModified: false,
  isDirty: false,
  isValid: true,
  totalPurchasePrice: 0,
  totalUnitsPurchasePrice: 0,
  totalUnitsRebates: 0,
  totalUnitsFreightPrepHandling: 0,
  deposits: [],
};

describe('WorksheetEffects', () => {
  let actions$: Observable<Action>;
  let effects: WorksheetEffects;
  let worksheetService: WorksheetService;
  let worksheetFacade: WorksheetFacade;
  let dealFacade: DealFacade;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        WorksheetEffects,
        provideMockActions(() => actions$),
        {
          provide: WorksheetService,
          useValue: MockWorksheetService,
        },
        {
          provide: LoaderService,
          useValue: MockLoaderService,
        },
        {
          provide: AppFacade,
          useValue: {
            ...MockAppFacade,
            currentRouteState$: of({ url: 'https//:worksheet' }),
          },
        },
        {
          provide: UserFacade,
          useValue: {
            ...MockUserFacade,
            currentOrgId$: of(1),
            taxes$: of(mockAppTaxData),
          },
        },
        {
          provide: DealFacade,
          useValue: {
            ...MockDealFacade,
            dealId$: of(5),
          },
        },
        {
          provide: WorksheetFacade,
          useValue: {
            ...MockWorkSheetFacade,
            workSheetDetails$: of(WorksheetData),
            showRatingDialog$: of({ present: true, ratingDialog: true }),
            currentRouteParams$: of({ unitId: 1 }),
            isDealTypeChanged$: of(true),
            isTaxProfileChanged$: of(true),
            activeUnitIndex$: of(1),
          },
        },
        {
          provide: Router,
          useValue: MockRouterService,
        },
        {
          provide: EventService,
          useValue: MockEventService,
        },
        { provide: TaxFacade, useValue: MockTaxManagementFacade }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    effects = TestBed.inject(WorksheetEffects);
    worksheetService = TestBed.inject(WorksheetService);
    worksheetFacade = TestBed.inject(WorksheetFacade);
    dealFacade = TestBed.inject(DealFacade);
  });

  it('should be create', () => {
    expect(effects).toBeTruthy();
  });

  describe('should handle getWorksheetDetails effect', () => {
    it('should return an getWorksheetDetails action, with the details, on success', () => {
      const action = WorksheetActions.getWorksheetDetails({ data: true });

      const outcome = WorksheetActions.getWorksheetDetailsSuccess({ data: { ...WorksheetData, isValid: true } });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: { ...WorksheetData, isValid: true } });
      const expected = cold('--b', { b: outcome });

      worksheetService.getWorkSheetDetails = jest.fn(() => response);

      expect(effects.getWorksheetDetails$).toBeObservable(expected);
    });

    it('should return an getWorksheetDetails unlockEvent action, with the details, on success', () => {
      const action = WorksheetActions.unlockEvent({ data: false });

      const outcome = WorksheetActions.getWorksheetDetailsSuccess({ data: { ...WorksheetData, isValid: true } });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: { ...WorksheetData, isValid: true } });
      const expected = cold('--b', { b: outcome });

      worksheetService.getWorkSheetDetails = jest.fn(() => response);
    });

    it('should return an getWorksheetDetails action, with the details, on failure', () => {
      const action = WorksheetActions.getWorksheetDetails({ data: true });
      const outcome = WorksheetActions.getWorksheetDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: { ...WorksheetData, isValid: true } });
      const expected = cold('--b', { b: outcome });

      worksheetService.getWorkSheetDetails = jest.fn(() => response);

      expect(effects.getWorksheetDetails$).toBeObservable(expected);
    });
  });

  describe('getWorksheetDetailsSuccess$', () => {
    it('should be return getWorksheetDetailsSuccess$', () => {
      const action = WorksheetActions.getWorksheetDetailsSuccess({ data: WorksheetData });
      actions$ = cold('-a', { a: action });
      const expected = cold('-b', { b: WorksheetData });

      expect(effects.getWorksheetDetailsSuccess$).toBeObservable(expected);
    });
  });

  describe('should handle tradeInDetails effect', () => {
    const tradeInDetails: TradeInDetails = 
      {
        id: 1,
        label: '',
        allowance: 2,
        payoff: 3,
        netTradeIn: 2,
        isDirty: false,
        isValid: true,
        isTaxCredit: false,
      };
    it('should return an saveWorkshetDetails action, with the details, on success', () => {
      const action = WorksheetActions.updateTradeInDetails({ data: tradeInDetails });
      const outcome = WorksheetActions.calculateWorksheetDetailsSuccess({ data: { ...WorksheetData } });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: { ...WorksheetData } });
      const expected = cold('--b', { b: outcome });

      worksheetService.updateWorksheetDetails = jest.fn(() => response);
    });

    it('should return an saveWorkshetDetails action, with the details, on failure', () => {
      const action = WorksheetActions.calculateWorksheetDetails({ data: true });
      const outcome = WorksheetActions.calculateWorksheetDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: WorksheetData });
      const expected = cold('--b', { b: outcome });

      worksheetService.updateWorksheetDetails = jest.fn(() => response);

      expect(effects.saveWorksheetDetails$).toBeObservable(expected);
    });
  });

  it('should be return resetRating$', () => {
    const action = WorksheetActions.resetRatingProducts({ data: false });
    actions$ = cold('-a', { a: action });
    worksheetService.resetRatingProducts = jest.fn(() => null);
    expect(effects.resetRating$).not.toBeObservable(cold('-a', { a: action }));
  });

  describe('toggle$', () => {
    it('should be return toggle$', () => {
      const payload = { products: product, unitIndex: 1, isValid: true, isDirty: true };
      const action = WorksheetActions.updateProtectionProducts({ data: payload });
      actions$ = cold('-a', { a: action });
      expect(effects.toggle$).toBeObservable(cold('-a', { a: action }));
    });
  });

  it('should check updateDeliveryDate not dispatch method', () => {
    const action = WorksheetActions.updateDeliveryDate({ data: new Date() });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: action });

     expect(effects.updateDeliveryDate$).not.toBeObservable(response);
  });

  it('should return an getActiveUnit action, with the details, on success', () => {
    const action = WorksheetActions.getActiveUnit();
    const outcome = WorksheetActions.getActiveUnitSuccess({ data: 1 });

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.getActiveUnit$).not.toBeObservable(expected);
  });

  it('should return an updateTabLocks action, with the details, on success', () => {
    const lockData: DealTabLocks = {
      isUnitLocked: true,
      isWorksheetLocked: true,
      isPartAccessoriesLocked: true,
    };
    const action = WorksheetActions.updateTabLocks();
    const outcome = dealFacade.updateDealTabLocks(lockData);

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.updateTabLocks$).not.toBeObservable(expected);
  });

  describe('should handle updateTaxesDetails effect', () => {
    it('should return an updateTaxesDetails action, with the details, on success', () => {
      const action = WorksheetActions.getWorksheetDetailsSuccess({ data: worksheetData });
      const outcome = WorksheetActions.updateTaxesSuccess({ data: worksheetData });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: worksheetData });
      const expected = cold('--b', { b: outcome });

      expect(effects.updateTaxesDetails$).not.toBeObservable(expected);

    });


    it('should return an updateTaxesDetails action, with the details, on success', () => {
      const action = WorksheetActions.calculateWorksheetDetailsSuccess({ data: worksheetData });
      const outcome = WorksheetActions.updateTaxesSuccess({ data: worksheetData });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: worksheetData });
      const expected = cold('--b', { b: outcome });

      expect(effects.updateTaxesDetails$).not.toBeObservable(expected);

    });
  });

  it('should return an updateCustomerTaxes action, with the details, on success', () => {
    const action = WorksheetActions.updateTaxesSuccess({ data: worksheetData });
    const outcome = worksheetFacade.calculateWorksheetDetails(true);

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.updateCustomerTaxes$).not.toBeObservable(expected);
  });

  it('should return an updateWorksheetDetails action, with the details, on success', () => {
    const action = WorksheetActions.salesOtherTaxes({ data: componentDataTax });
    const outcome = worksheetFacade.calculateWorksheetDetails(false);

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.updateWorksheetDetails$).not.toBeObservable(expected);
  });

  it('should return an resetRatingProductsSuccess action, with the details, on success', () => {
    const action = WorksheetActions.resetRatingProductsSuccess({ data: true });
    const outcome = worksheetFacade.showRateProduct(true);

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.resetRatingProductsSuccess$).not.toBeObservable(expected);
  });
});
