import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ContractUnit, ImportUnit, Unit, UnitInfo, UnitOption } from '@app/entities';
import * as UnitActions from '../actions';
import * as UnitSelectors from '../selectors';

@Injectable()
export class UnitsFacade {
  loaded$ = this.store.pipe(select(UnitSelectors.loaded));
  activeUnit$ = this.store.pipe(select(UnitSelectors.activeUnit));
  lastNumOrder$ = this.store.pipe(select(UnitSelectors.lastNumOrder));
  unitsReordered$ = this.store.pipe(select(UnitSelectors.unitsReordered));
  activeUnitTab$ = this.store.pipe(select(UnitSelectors.activeUnitTabIndex));

  unitViewModel$ = this.store.pipe(select(UnitSelectors.unitViewModel));
  marineSidebarViewModel$ = this.store.pipe(select(UnitSelectors.marineSidebarViewModel));

  units$ = this.store.pipe(select(UnitSelectors.units));
  unitOptions$ = this.store.pipe(select(UnitSelectors.unitOptions));

  isValid$ = this.store.pipe(select(UnitSelectors.isValid));
  isDirty$ = this.store.pipe(select(UnitSelectors.isDirty));

  openRatingDialog$ = this.store.pipe(select(UnitSelectors.openRatingDialog));

  constructor(private readonly store: Store) { }

  getUnitsTabData(refresh = false) {
    this.store.dispatch(UnitActions.getUnitsTabData({ data: refresh }));
  }

  getUnitsTabDataSuccess(unitInfo: UnitInfo) {
    this.store.dispatch(UnitActions.getUnitsTabDataSuccess({ data: unitInfo }));
  }

  addUnit() {
    this.store.dispatch(UnitActions.addUnit());
  }

  addSubUnit(clone: boolean, subType: string) {
    this.store.dispatch(UnitActions.addSubUnit({ data: { clone, subType } }));
  }

  unitTabChange(payload: number) {
    this.store.dispatch(UnitActions.unitTabChange({ data: payload }));
  }

  unitSubTabChange(payload: number) {
    this.store.dispatch(UnitActions.unitSubTabChange({ data: payload }));
  }

  deleteUnit(index: number) {
    this.store.dispatch(UnitActions.deleteUnit({ data: index }));
  }

  updateUnitType(unitType: string, activeUnitTab: number) {
    this.store.dispatch(UnitActions.updateUnitType({ data: { type: unitType, activeUnitTab } }));
  }

  deleteSubUnit(index: number = 0) {
    this.store.dispatch(UnitActions.deleteSubUnit({ data: index }));
  }

  addAccessory(payload: UnitOption) {
    this.store.dispatch(UnitActions.addAccessory({ data: payload }));
  }

  editAccessory(payload: UnitOption) {
    this.store.dispatch(UnitActions.editAccessory({ data: payload }));
  }

  deleteAccessory(payload: UnitOption) {
    this.store.dispatch(UnitActions.deleteAccessory({ data: payload }));
  }

  unitDetailsUpdated(unitDetails: Unit, isDirty: boolean, isValid: boolean) {
    this.store.dispatch(UnitActions.unitDetailsUpdated({ data: { unitDetails, isDirty, isValid } }));
  }

  unitSave(manual = false, skipValidation = false, unitDrag=false) {
    this.store.dispatch(UnitActions.autoSaveUnit({ data: { manual, skipValidation, unitDrag } }));
  }

  updateUnits(units: Unit[]) {
    this.store.dispatch(UnitActions.updateUnits({ data: units }));
  }

  setOpenRatingDialog(action: boolean) {
    this.store.dispatch(UnitActions.setOpenRatingDialog({ data: action }));
  }

  updateUnitsAfterValidate(units: Unit[]) {
    this.store.dispatch(UnitActions.updateUnitsAfterValidate({ data: units }));
  }

  updateUnitFormStatus(formDirty = false, formValid: boolean) {
    this.store.dispatch(UnitActions.updateUnitFormStatus({ data: { formDirty, formValid } }));
  }

  addImportUnit(payload: ImportUnit) {
    this.store.dispatch(UnitActions.addImportUnit({ data: payload }));
  }

  updateImportUnit(payload: ImportUnit, unitId: number) {
    this.store.dispatch(UnitActions.updateImportUnit({ data: { importUnit: payload, unitId } }));
  }

  updateUnitsDetail(unit: ContractUnit[]){
    this.store.dispatch(UnitActions.updateUnitsDetail({ data: unit }));
  }
  reOderUnits(tabs:[], currentIndex){
    this.store.dispatch(UnitActions.reorderUnits({ data: {tabs, currentIndex}}));
  }

}
