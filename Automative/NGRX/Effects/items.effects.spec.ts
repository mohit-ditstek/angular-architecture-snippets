import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  ImportUnit,
  UnitData,
  UnitInfo,
  UnitOption,
  UnitOverviewData,
  UnitSetupType,
  Units,
  UnitsData,
} from '@app/entities';
import {
  MockDialogService,
  MockSnackbarService,
  MockUtilityService,
  ModalService,
  SnackbarService,
  UtilityService,
} from '@app/shared/services';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { MockUserFacade, UserFacade } from '@app/store/user';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { UnitsService } from '../../services';
import {
  MockDealFacade,
  MockUnitsFacade,
  MockUnitsService,
} from '../../testing';
import * as UnitActions from '../actions';
import { DealFacade, UnitsFacade } from '../facades';
import { UnitsEffects } from './units.effects';
import { unitsData } from '@app/features/customers/crm-lead';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
const importUnit: ImportUnit = {
  providerCode: 'Code',
  importId: '423',
  skipValidation: false,
};

const unitData: UnitInfo = {
  options: UnitOverviewData,
  units: [UnitData],
};
const unitOption: UnitOption = {
  id: 1,
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
let unitsReordered: boolean;
describe('UnitsEffects', () => {
  let unitService: UnitsService;
  let actions$: Observable<Action>;
  let effects: UnitsEffects;
  let unitFacade: UnitsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
      providers: [
        UnitsEffects,
        provideMockActions(() => actions$),
        {
          provide: UnitsService,
          useValue: MockUnitsService,
        },
        {
          provide: UnitsFacade,
          useValue: {
            ...MockUnitsFacade,
            unitsReordered$: of(unitsReordered),
            units$: of(UnitsData),
            lastNumOrder$: of(1),
          },
        },
        {
          provide: UserFacade,
          useValue: MockUserFacade,
        },
        {
          provide: DealFacade,
          useValue: MockDealFacade,
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
          provide: ModalService,
          useValue: MockDialogService,
        },
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    effects = TestBed.inject(UnitsEffects);
    unitService = TestBed.inject(UnitsService);
    unitFacade = TestBed.inject(UnitsFacade);
  });
  it('should be create', () => {
    expect(effects).toBeTruthy();
  });

  describe('getUnitsTabData', () => {
    it('should return an getUnitsTabData action, with the client, on success', () => {
      const action = UnitActions.getUnitsTabData({ data: true });
      const outcome = UnitActions.getUnitsTabDataSuccess({ data: unitData });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: unitData });
      const expected = cold('--b', { b: outcome });

      unitService.getUnits = jest.fn(() => response);

      expect(effects.getUnits$).toBeObservable(expected);
    });
    it('should return an getUnitsTabData action, with the client, on Failure', () => {
      const action = UnitActions.getUnitsTabData({ data: true });
      const outcome = UnitActions.getUnitsTabDataFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: unitData });
      const expected = cold('--b', { b: outcome });

      unitService.getUnits = jest.fn(() => response);

      expect(effects.getUnits$).toBeObservable(expected);
    });
  });

  describe('deleteAccessory', () => {
    it('should return an deleteAccessory action, with the client, on success', () => {
      const action = UnitActions.deleteAccessory({ data: unitOption });
      const outcome = UnitActions.deleteAccessorySuccess({ data: unitOption });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: unitOption });
      const expected = cold('--b', { b: outcome });

      unitService.deleteAccessory = jest.fn(() => response);

      expect(effects.deleteAccessory$).toBeObservable(expected);
    });

    it('should return an deleteAccessory action, with the client, on null', () => {
      const action = UnitActions.deleteAccessory({ data: null });
      const outcome = UnitActions.deleteAccessorySuccess({ data: null });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: null });
      const expected = cold('--b', { b: outcome });

      unitService.deleteAccessory = jest.fn(() => response);

      expect(effects.deleteAccessory$).not.toBeObservable(expected);
    });
  });

  describe('editAccessories', () => {
    it('should return an editAccessories action, with the client, on success', () => {
      const action = UnitActions.editAccessory({ data: unitOption });
      const outcome = UnitActions.editAccessorySuccess({ data: unitOption });
      const updatedUnitOption = { ...unitOption, id: 2 };
      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: updatedUnitOption });
      const expected = cold('--b', { b: outcome });

      unitService.editAccessory = jest.fn(() => response);

      expect(effects.editAccessories$).toBeObservable(expected);
    });

    it('should return an editAccessories action, with the client, on Failure', () => {
      const action = UnitActions.editAccessory({ data: unitOption });
      const outcome = UnitActions.editAccessoryFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: null });
      const expected = cold('--b', { b: outcome });

      unitService.editAccessory = jest.fn(() => response);

      expect(effects.editAccessories$).toBeObservable(expected);
    });
  });

  describe('addAccessory effect', () => {
    it('should return an addAccessory action, with the client, on success', () => {
      const action = UnitActions.addAccessory({ data: unitOption });
      const outcome = UnitActions.addAccessorySuccess({ data: unitOption });
      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 1 });
      const expected = cold('--b', { b: outcome });

      unitService.addAccessory = jest.fn(() => response);

      expect(effects.addAccessories$).toBeObservable(expected);
    });

    it('should return an addAccessory action, with the client, on Failure', () => {
      const action = UnitActions.addAccessory({ data: unitOption });
      const outcome = UnitActions.addAccessoryFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: null });
      const expected = cold('--b', { b: outcome });

      unitService.addAccessory = jest.fn(() => response);

      expect(effects.addAccessories$).toBeObservable(expected);
    });
  });

  describe('deleteUnit', () => {
    it('should return an deleteUnit action, with the client, on success fail', () => {
      const action = UnitActions.deleteUnit({ data: 0 });
      const outcome = UnitActions.deleteUnitSuccess({ data: 0 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 0 });
      const expected = cold('--b', { b: outcome });

      unitService.deleteUnit = jest.fn(() => response);

      expect(effects.deleteUnit$).toBeObservable(expected);
    });

    it('should return an deleteUnit action, with the client, on Failure', () => {
      const action = UnitActions.deleteUnit({ data: 0 });
      const outcome = UnitActions.deleteUnitFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: null });
      const expected = cold('--b', { b: outcome });

      unitService.deleteUnit = jest.fn(() => response);

      expect(effects.deleteUnit$).toBeObservable(expected);
    });
  });

  describe('should handle deleteSubUnit effect', () => {
    it('should return an deleteSubUnit action, with the client, on success', () => {
      const action = UnitActions.deleteSubUnit({ data: 0 });
      const outcome = UnitActions.deleteSubUnitSuccess({ data: 0 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: 0 });
      const expected = cold('--b', { b: outcome });

      unitService.deleteUnit = jest.fn(() => response);

      expect(effects.deleteSubUnit$).toBeObservable(expected);
    });

    it('should return an deleteSubUnit action, with the client, on Failure', () => {
      const action = UnitActions.deleteSubUnit({ data: 2 });
      const outcome = UnitActions.deleteSubUnitFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: null });
      const expected = cold('--b', { b: outcome });

      unitService.deleteUnit = jest.fn(() => response);

      expect(effects.deleteSubUnit$).not.toBeObservable(expected);
    });
  });

  it('should return an getUnitsTabDataSuccess action, with the client, on Success', () => {
    const action = UnitActions.getUnitsTabDataSuccess({ data: unitData });

    actions$ = hot('-a', { a: action });

    expect(effects.getUnitsSuccess$).not.toBeUndefined();
  });

  it('should return an autoSaveMultiUnit action, with the client, on success', () => {
    unitsReordered = true;
    const action = UnitActions.autoSaveUnit({
      data: { manual: true, skipValidation: true, unitDrag: true },
    });
    const outcome = UnitActions.autoSaveMultiUnit({ data: UnitsData });
    actions$ = hot('-a', { a: action });
    const response = cold('-a|', {
      a: { manual: true, skipValidation: true, unitDrag: true },
    });
    const expected = cold('--b', { b: outcome });

    expect(effects.autoSave$).not.toBeObservable(expected);
  });

  it('should return an autoSaveMultiUnit action, with the client, on success', () => {
    unitsReordered = false;
    const action = UnitActions.autoSaveUnit({
      data: { manual: true, skipValidation: true, unitDrag: true },
    });
    const outcome = UnitActions.autoSaveMultiUnit({ data: UnitsData });
    actions$ = hot('-a', { a: action });
    const response = cold('-a|', {
      a: { manual: true, skipValidation: true, unitDrag: true },
    });
    const expected = cold('--b', { b: outcome });

    expect(effects.autoSave$).not.toBeObservable(expected);
  });

  describe('updateUnits', () => {
    it('should return an updateUnits action, with the client, on success', () => {
      const action = UnitActions.updateUnits({ data: [UnitData] });
      const outcome = UnitActions.updateUnitsSuccess({ data: false });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: true });
      const expected = cold('--b', { b: outcome });

      unitService.updateUnits = jest.fn(() => response);

      expect(effects.updateUnits$).toBeObservable(expected);
    });
  });

  describe('updateImportUnit', () => {
    it('should return an updateImportUnitSuccess action, with the client, on success', () => {
      const scheduler = getTestScheduler();
      scheduler.run((helpers) => {
        const action = UnitActions.updateImportUnit({
          data: { importUnit: importUnit, unitId: 12 },
        });
        const outcome = UnitActions.updateImportUnitSuccess();

        actions$ = helpers.hot('-a', { a: action });
        const response = cold('-a|', { a: 1 });
        const expected = cold('--b', { b: outcome });

        unitService.updateImportUnit = jest.fn(() => response);
        expect(effects.updateImportUnit$).toBeObservable(expected);
      });
    });
  });
  describe('addImportUnit', () => {
    it('should return an addImportUnitFailure action, with the client, on Failure', () => {
      const action = UnitActions.addImportUnit({ data: importUnit });
      const outcome = UnitActions.addImportUnitFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: 1 });
      const expected = cold('--b', { b: outcome });

      unitService.addImportUnit = jest.fn(() => response);
      expect(effects.addImportUnit$).not.toBeObservable(expected);
    });
  });

  describe('should handle autoSaveSingleUnit effect', () => {
    it('should return an autoSaveSingleUnit action, with the client, on success', () => {
      const action = UnitActions.autoSaveSingleUnit({
        data: { manual: true, skipValidation: false },
      });
      const outcome = UnitActions.autoSaveUnitSuccess({ data: UnitData });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: UnitData });
      const expected = cold('--b', { b: outcome });

      unitService.updateUnits = jest.fn(() => response);

      expect(effects.autoSaveSingleUnit$).not.toBeObservable(expected);
    });

    it('should return an autoSaveSingleUnit action, with the client, on Failure', () => {
      const action = UnitActions.autoSaveSingleUnit({
        data: { manual: true, skipValidation: false },
      });
      const outcome = UnitActions.autoSaveUnitFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: UnitData });
      const expected = cold('--b', { b: outcome });

      unitService.updateUnits = jest.fn(() => response);

      expect(effects.autoSaveSingleUnit$).not.toBeObservable(expected);
    });
  });

  describe('should handle autoSaveMultiUnit effect', () => {
    const units: Units = {
      units: UnitsData,
    };
    it('should return an autoSaveMultiUnit action, with the client, on success', () => {
      const action = UnitActions.autoSaveMultiUnit({ data: UnitsData });
      const outcome = UnitActions.autoSaveMultiUnitSuccess({ data: units });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: units });
      const expected = cold('--b', { b: outcome });

      unitService.updateUnits = jest.fn(() => response);

      expect(effects.autoSaveMultiUnit$).not.toBeObservable(expected);
    });

    it('should return an autoSaveSingleUnit action, with the client, on Failure', () => {
      const action = UnitActions.autoSaveMultiUnit({ data: UnitsData });

      const outcome = UnitActions.autoSaveUnitFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: units });
      const expected = cold('--b', { b: outcome });

      unitService.updateUnits = jest.fn(() => response);

      expect(effects.autoSaveMultiUnit$).toBeObservable(expected);
    });
  });

  it('should return an updateUnitsFailure action, with the client, on success', () => {
    const payload: HttpErrorResponse[] =[{
      name: 'HttpErrorResponse',
      message: '',
      error: undefined,
      ok: false,
      headers: new HttpHeaders,
      status: 0,
      statusText: '',
      url: '',
      type: HttpEventType.ResponseHeader
    }];
    const action = UnitActions.updateUnitsFailure({ data: payload });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: [] });
    const expected = cold('--b', { b: {} });

    unitService.updateUnits = jest.fn(() => response);

    expect(effects.updateUnitsFailure$).not.toBeObservable(expected);
  });

  it('should return an updateUnitsSuccess action, with the client, on success', () => {
    const action = UnitActions.updateUnitsSuccess({ data: true });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: [] });
    const expected = cold('--b', { b: {} });

    unitService.updateUnits = jest.fn(() => response);

    expect(effects.updateUnitsSuccess$).not.toBeObservable(expected);
  });
});
