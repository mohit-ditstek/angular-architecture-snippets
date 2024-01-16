import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  AddressData,
  DMSPushDealRequest,
  DealTabType,
  ProviderCode,
  QuickActionRequest,
  UpdateContactsRequest,
  WorksheetDetails
} from '@app/entities';
import { IdPipe } from '@app/shared/pipes';
import { MockDialogService, MockSnackbarService, MockUtilityService, ModalService, SnackbarService, UtilityService } from '@app/shared/services';
import { MockRouterService } from '@app/shared/testing';
import { MockCustomerFacade } from '@app/store/customer';
import { FreshDeskService, MockPermissionService, MockUserFacade, PermissionService, TaxFacade, UserFacade } from '@app/store/user';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { Deal, DealUnlockResponse } from '../../models';
import { DealService } from '../../services';
import {
  CustomerInfoData,
  DealLenderData,
  DealOverviewData,
  LossPayeeData,
  MockDealFacade,
  MockDealService,
  MockNotesFacade,
  MockTradeInFacade,
  MockUnitsFacade,
  MockWorkSheetFacade,
  quickActionUpdateRequest,
} from '../../testing';
import * as DealActions from '../actions';
import { CustomerFacade, DealFacade, NotesFacade, TradeInFacade, UnitsFacade, WorksheetFacade } from '../facades';
import { CommonEffects } from './common.effects';
import { MockTaxRateData } from '@app/features/tax-profile/tax-profile-configuration';

const lenderDetails = {
  dealLenderId: 2,
  orgLenderId: 2,
  referenceId: 'test',
  name: 'test',
  decisionStatus: 2,
  amount: 2,
  term: 2,
  buyRate: 2,
  maxRate: 2,
  customerRate: 2,
  maxBackEndAmount: 2,
  eltCode: 'test',
  notes: 'test',
  isSelected: false,
  modifyDateTimeUtc: 'test',
  modifyUserName: 'test',
  lienHolder: DealLenderData,
  lossPayee: LossPayeeData,
};
const updateSalesPersonRequest: UpdateContactsRequest = {
  salesPerson: 'Sale Person',
};

const customerDetails = {
  customerType: 1,
  customers: [],
  isValidationDisabled: false,
};
const dealDetails: any = {
  ...DealOverviewData,
  lenderInfo: lenderDetails,
  customerInfo: customerDetails,
  unitInfo: null,
  worksheet: new WorksheetDetails(),
  tradeIns: [],
};
const dealActionRequest: QuickActionRequest = {
  dealId: 11,
  reason: '',
  markOriginalDead: false,
};

const dealUnLockResponse: DealUnlockResponse = {
  isVoidSuccess: true,
  errors: [],
  currentTab: DealTabType.Customer,
};

describe('CommonEffects', () => {
  let actions$: Observable<Action>;
  let effects: CommonEffects;
  let dealService: DealService;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
      providers: [
        CommonEffects,
        { provide: CustomerFacade, useValue: MockCustomerFacade },
        { provide: UnitsFacade, useValue: MockUnitsFacade },
        { provide: WorksheetFacade, useValue: MockWorkSheetFacade },
        { provide: DealFacade, useValue: MockDealFacade },
        { provide: TradeInFacade, useValue: MockTradeInFacade },
        { provide: UserFacade, useValue: { ...MockUserFacade, currentOrgId$: of(1) } },
        { provide: PermissionService, useValue: MockPermissionService },
        { provide: Router, useValue: MockRouterService },
        { provide: NotesFacade, useValue: MockNotesFacade },
        {
          provide: FreshDeskService,
          useValue: {
            setCustomFields: jest.fn(),
          },
        },
        provideMockActions(() => actions$),
        {
          provide: DealService,
          useValue: MockDealService,
        },
        {
          provide: UserFacade,
          useValue: {
            ...MockUserFacade,

            user$: of({ orgId: 2 }),
          },
        },
        {
          provide: DealFacade,
          useValue: MockDealFacade,
        },
        {
          provide: ModalService,
          useValue: MockDialogService,
        },
        {
          provide: SnackbarService,
          useValue: MockSnackbarService,
        },
        {
          provide: UtilityService,
          useValue: MockUtilityService,
        },
        {
          provide: Router,
          useValue: MockRouterService,
        },
        { provide: TaxFacade, useValue: {resetCustomerTaxes: jest.fn()} },
        
        { provide: IdPipe, useValue: true },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    effects = TestBed.inject(CommonEffects);
    dealService = TestBed.inject(DealService);
  });
  it('should be create', () => {
    expect(effects).toBeTruthy();
  });
  it('should return newDeal$ effect ', () => {
    const defaultDeal = dealDetails;

    const action = DealActions.newDeal();
    const outcome = DealActions.getDealSuccess({ data: defaultDeal });

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });

    expect(effects.newDeal$).not.toBeObservable(expected);
  });
  describe('should check getDeal$ effect', () => {
    const action = DealActions.getDeal({ data: 1 });
    it('should return getDealSuccess action, with the getDeal, on success', () => {
      const outcome = DealActions.getDealSuccess({ data: dealDetails });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: dealDetails });
      const expected = cold('--b', { b: outcome });

      dealService.getDealDetails = jest.fn(() => response);

      expect(effects.getDeal$).toBeObservable(expected);
    });
    it('should return getDealFailure action', () => {
      const outcome = DealActions.getDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: dealDetails });
      const expected = cold('--b', { b: outcome });

      dealService.getDealDetails = jest.fn(() => response);

      expect(effects.getDeal$).toBeObservable(expected);
    });
  });
  it('should return getDealSuccess$ action,  ', () => {
    // Todo need to be discuss
    const data: Deal = dealDetails;
    const action = DealActions.getDealSuccess({ data });
    const outcome = DealActions.getDealSuccess({ data });

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });
    expect(effects.getDealSuccess$).not.toBeObservable(expected);
  });

  describe('should check updateContacts$ effect', () => {
    const action = DealActions.updateContacts({ data: updateSalesPersonRequest });
    it('should return updateContactsSuccess action ', () => {
      const outcome = DealActions.updateContactsSuccess({ data: updateSalesPersonRequest });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: updateSalesPersonRequest });
      const expected = cold('--b', { b: outcome });

      dealService.updateContacts = jest.fn(() => response);

      expect(effects.updateContacts$).toBeObservable(expected);
    });
    it('should return updateContactsFailure action ', () => {
      const outcome = DealActions.updateContactsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: updateSalesPersonRequest });
      const expected = cold('--b', { b: outcome });

      dealService.updateContacts = jest.fn(() => response);

      expect(effects.updateContacts$).toBeObservable(expected);
    });
  });
  it('should return resetEvent action,  ', () => {
    const action = DealActions.resetEvent();
    const outcome = DealActions.resetEvent();

    actions$ = hot('-a', { a: action });
    const expected = cold('--b', { b: outcome });
    expect(effects.resetEvent$).not.toBeObservable(expected);
  });
  describe('should check updateDealTabUnLocks$ effect', () => {
    const action = DealActions.updateDealTabUnLocks({ data: DealTabType.Customer });
    it('should return updateDealTabUnLocksSuccess action ', () => {
      const outcome = DealActions.updateDealTabUnLocksSuccess({ data: dealUnLockResponse });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: dealUnLockResponse });
      const expected = cold('--b', { b: outcome });

      dealService.updateDealTabUnLocks = jest.fn(() => response);

      expect(effects.updateDealTabUnLocks$).toBeObservable(expected);
    });
    it('should return updateDealTabUnLocksFailure action ', () => {
      const outcome = DealActions.updateDealTabUnLocksFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: dealUnLockResponse });
      const expected = cold('--b', { b: outcome });

      dealService.updateDealTabUnLocks = jest.fn(() => response);

      expect(effects.updateDealTabUnLocks$).toBeObservable(expected);
    });
  });
  describe('should check updateDealTabUnLocksSuccess$ effect', () => {
    it('should return updateDealTabUnLocksSuccess with isVoidSuccess is true, on success,  ', () => {
      const action = DealActions.updateDealTabUnLocksSuccess({ data: dealUnLockResponse });
      const outcome = DealActions.updateDealTabUnLocksSuccess({ data: dealUnLockResponse });

      actions$ = hot('-a', { a: action });
      const expected = cold('--b', { b: outcome });
      expect(effects.updateDealTabUnLocksSuccess$).not.toBeObservable(expected);
      jest.advanceTimersByTime(0);
    });
    it('should return updateDealTabUnLocksSuccess with isVoidSuccess is false, on success,  ', () => {
      const data = { ...dealUnLockResponse, isVoidSuccess: false };
      const action = DealActions.updateDealTabUnLocksSuccess({ data });
      const outcome = DealActions.updateDealTabUnLocksSuccess({ data });

      actions$ = hot('-a', { a: action });
      const expected = cold('--b', { b: outcome });
      expect(effects.updateDealTabUnLocksSuccess$).not.toBeObservable(expected);
      jest.advanceTimersByTime(0);
    });
  });

  describe('should create clone deal', () => {
    it('should return create clone deal success ', () => {
      const action = DealActions.createCloneDeal({ data: dealActionRequest });
      const outcome = DealActions.createCloneDealSuccess({ data: 2 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 2 });
      const expected = cold('--b', { b: outcome });

      dealService.createCloneDeal = jest.fn(() => response);

      expect(effects.createCloneDeal$).toBeObservable(expected);
    });
    it('should return create clone deal failure ', () => {
      const action = DealActions.createCloneDeal({ data: dealActionRequest });
      const outcome = DealActions.createCloneDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 2 });
      const expected = cold('--b', { b: outcome });

      dealService.createCloneDeal = jest.fn(() => response);

      expect(effects.createCloneDeal$).toBeObservable(expected);
    });
  });

  describe('should check deleteDeal effect', () => {
    const action = DealActions.deleteDeal({ data: dealActionRequest });
    it('should return deleteDealSuccess action ', () => {
      const outcome = DealActions.deleteDealSuccess({ data: 11 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.deleteDeal = jest.fn(() => response);

      expect(effects.deleteDeal$).toBeObservable(expected);
    });
    it('should return deleteDealFailure action ', () => {
      const outcome = DealActions.deleteDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.deleteDeal = jest.fn(() => response);

      expect(effects.deleteDeal$).toBeObservable(expected);
    });
  });

  describe('should check markDeadDeal effect', () => {
    const action = DealActions.markDeadDeal({ data: dealActionRequest });
    it('should return markDeadDealSuccess action ', () => {
      const outcome = DealActions.markDeadDealSuccess({ data: 11 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.markDeadDeal = jest.fn(() => response);

      expect(effects.markDeadDeal$).toBeObservable(expected);
    });
    it('should return markDeadDealFailure action ', () => {
      const outcome = DealActions.markDeadDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.markDeadDeal = jest.fn(() => response);

      expect(effects.markDeadDeal$).toBeObservable(expected);
    });
  });

  describe('should check dmsRefresh effect', () => {
    const action = DealActions.dmsRefresh({ data: 11 });
    it('should return dmsRefreshSuccess action ', () => {
      const outcome = DealActions.dmsRefreshSuccess({ data: 11 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.dmsRefresh = jest.fn(() => response);

      expect(effects.dmsRefresh$).toBeObservable(expected);
    });
  });

  describe('should check dmsUpdate effect', () => {
    const action = DealActions.dmsUpdate({ data: 11 });
    it('should return dmsUpdateSuccess action ', () => {
      const outcome = DealActions.dmsUpdateSuccess();

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.dmsUpdate = jest.fn(() => response);

      expect(effects.dmsUpdate$).toBeObservable(expected);
    });
    it('should return closeDealFailure action ', () => {
      const outcome = DealActions.dmsUpdateFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 0 });
      const expected = cold('--b', { b: outcome });

      dealService.dmsUpdate = jest.fn(() => response);

      expect(effects.dmsUpdate$).toBeObservable(expected);
    });
  });

  describe('should check closeDeal effect', () => {
    const action = DealActions.closeDeal({ data: quickActionUpdateRequest });
    it('should return closeDealSuccess action ', () => {
      const outcome = DealActions.closeDealSuccess({ data: 11 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.closeDeal = jest.fn(() => response);

      expect(effects.closeDeal$).toBeObservable(expected);
    });
    it('should return closeDealFailure action ', () => {
      const outcome = DealActions.closeDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.closeDeal = jest.fn(() => response);

      expect(effects.closeDeal$).toBeObservable(expected);
    });
  });
  describe('should check blockUnblockDeal effect', () => {
    const action = DealActions.blockUnblockDeal({ data: dealActionRequest });
    it('should return blockDealSuccess action ', () => {
      const outcome = DealActions.blockUnblockDealSuccess({ data: 11 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.blockDeal = jest.fn(() => response);

      expect(effects.blockUnblockDeal$).not.toBeObservable(expected);
    });
    it('should return blockDealFailure action ', () => {
      const outcome = DealActions.blockUnblockDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 11 });
      const expected = cold('--b', { b: outcome });

      dealService.blockDeal = jest.fn(() => response);

      expect(effects.blockUnblockDeal$).toBeObservable(expected);
    });
  });

  describe('should check dmsPushDeal effect', () => {
    const dmsPushQuoteDealRequest: DMSPushDealRequest = {
      providerCode: ProviderCode.Lightspeed,
      allowReExport: false,
    };
    const action = DealActions.dmsPushDeal({ data: dmsPushQuoteDealRequest });
    it('should return dmsPushDealSuccess action ', () => {
      const outcome = DealActions.dmsPushDealSuccess({ data: 12180 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 12180 });
      const expected = cold('--b', { b: outcome });

      dealService.dmsPushDeal = jest.fn(() => response);

      expect(effects.dmsPushDeal$).toBeObservable(expected);
    });
    it('should return dmsPushDealFailure action ', () => {
      const outcome = DealActions.dmsPushDealFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 12180 });
      const expected = cold('--b', { b: outcome });

      dealService.dmsPushDeal = jest.fn(() => response);

      expect(effects.dmsPushDeal$).not.toBeObservable(expected);
    });
  });
  it('should return updateContactsFailure action ', () => {
    const action = DealActions.getCustomersSuccess({ data: CustomerInfoData });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', { a: updateSalesPersonRequest });
    const expected = cold('--b', { b: [] });


    expect(effects.getCustomerSuccess$).not.toBeObservable(expected);
  });

 
});
