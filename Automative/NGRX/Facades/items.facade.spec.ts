import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ContractUnit, ImportUnit, UnitAgeType, UnitData, UnitInfo, UnitOption, UnitOverviewData, UnitSetupType, UnitsData } from '@app/entities';
import * as UnitActions from '../actions/units.action';
import { UnitsFacade } from '../facades';
const importUnit: ImportUnit = {
  providerCode: 'lightspeed',
  importId: '423',
  skipValidation: false,
};
const unitInfo: UnitInfo = {
  options: UnitOverviewData,
  units: UnitsData,
};

const mockUniData: ContractUnit[] = {
  id: 1,
  name: 'John',
  inServiceDate: 'Wed Apr 10 2024 17:58:44 GMT+0530',
  deliveryDate: 'Wed Apr 10 2024 17:58:44 GMT+0530',
  selectedProducts: [],
  age: UnitAgeType.Consignment,
  selectedAll: false,
  isInServiceDateVisible: false,
};
describe('Units Facade', () => {
  let facade: UnitsFacade;
  let store: Store;
  let dispatchSpy;
  const unitOption: UnitOption = {
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

  describe('Units Facade', () => {
    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forRoot({})],
        providers: [UnitsFacade],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] });
      store = TestBed.inject(Store);
      facade = TestBed.inject(UnitsFacade);
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
      expect(store).toBeTruthy();
    });

    it('should handle addUnit action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.addUnit();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.addUnit());
    });

    it('should handle unitTabChange action', async () => {
      const payload = 1;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.unitTabChange(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.unitTabChange({ data: payload }));
    });

    it('should handle removeUnit action', async () => {
      const index = 1;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.deleteUnit(index);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.deleteUnit({ data: index }));
    });

    it('should handle addAccessory action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.addAccessory(unitOption);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.addAccessory({ data: unitOption }));
    });

    it('should handle editAccessory action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.editAccessory(unitOption);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.editAccessory({ data: unitOption }));
    });

    it('should handle deleteAccessory action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.deleteAccessory(unitOption);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.deleteAccessory({ data: unitOption }));
    });

    it('should handle unitDetailsUpdated action', async () => {
      const unitDetails = UnitsData[0];
      const isDirty = false;
      const isValid = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.unitDetailsUpdated(unitDetails, isDirty, isValid);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.unitDetailsUpdated({ data: { unitDetails, isDirty, isValid } }));
    });

    it('should handle getUnitsTabDataSuccess action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getUnitsTabDataSuccess(unitInfo);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.getUnitsTabDataSuccess({ data: unitInfo }));
    });

    it('should handle getUnitsTabData action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getUnitsTabData();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.getUnitsTabData({ data: false }));
    });

    it('should handle autoSave action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.unitSave();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.autoSaveUnit({ data: { manual: false, skipValidation: false ,unitDrag:false} }));
    });

    it('should handle updateUnitType action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateUnitType('test', 1);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateUnitType({ data: { type: 'test', activeUnitTab: 1 } }));
    });

    it('should handle deleteSubUnit action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.deleteSubUnit(0);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.deleteSubUnit({ data: 0 }));
    });

    it('should handle unitSubTabChange action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.unitSubTabChange(1);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.unitSubTabChange({ data: 1 }));
    });

    it('should handle setOpenRatingDialog action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.setOpenRatingDialog(true);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.setOpenRatingDialog({ data: true }));
    });

    it('should handle addSubUnit action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.addSubUnit(true, 'test');
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.addSubUnit({ data: { clone: true, subType: 'test' } }));
    });

    it('should handle updateMultipleUnits action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateUnits([UnitData]);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateUnits({ data: [UnitData] }));
    });

    it('should handle updateUnitFormStatus action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      const isFormDirty = true;
      const isFormValid = true;
      facade.updateUnitFormStatus(isFormDirty, isFormValid);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateUnitFormStatus({ data: { formDirty: true, formValid: true } }));
    });
  });
  it('should handle addImportUnit action', async () => {
    dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.addImportUnit(importUnit);
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.addImportUnit({ data: importUnit }));
  });
  it('should handle updateImportUnit action', async () => {
    dispatchSpy = jest.spyOn(store, 'dispatch');

    facade.updateImportUnit(importUnit, 12);
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateImportUnit({ data: { importUnit, unitId: 12 } }));
  });

  it('should handle updateUnitsAfterValidate action', async () => {
    dispatchSpy = jest.spyOn(store, 'dispatch');

    facade.updateUnitsAfterValidate(UnitsData);
    expect(dispatchSpy).toBeCalledTimes(4);

    expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateUnitsAfterValidate({ data: UnitsData }));
  });

  it('should handle updateMultipleUnits action', async () => {
    dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.updateUnitsDetail(mockUniData);
    expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.updateUnitsDetail({ data: mockUniData }));
  });
  it('should handle reOderUnits action', async () => {
    const tabs: [] = [];
    const currentIndex = 0;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    facade.reOderUnits(tabs, currentIndex);
    expect(dispatchSpy).toHaveBeenCalledWith(UnitActions.reorderUnits({ data:{tabs,currentIndex} }));
  });
});


