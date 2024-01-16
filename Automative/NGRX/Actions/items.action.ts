import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { ActionPayloadData, ContractUnit, ImportUnit, Unit, UnitInfo, UnitOption, Units } from '@app/entities';

export const getUnitsTabData = createAction('[Units] Get Units Tab Data', props<ActionPayloadData<boolean>>());
export const getUnitsTabDataSuccess = createAction('[Units] Get Units Tab Data Success', props<ActionPayloadData<UnitInfo>>());
export const getUnitsTabDataFailure = createAction('[Units] Get Units Tab Data Failure');

export const addUnit = createAction('[Unit] Add Unit');
export const addSubUnit = createAction('[Unit] Add Sub Unit', props<ActionPayloadData<{ clone: boolean; subType: string }>>());

export const unitTabChange = createAction('[Unit] Unit Tab Change', props<ActionPayloadData<number>>());
export const unitSubTabChange = createAction('[Unit] Unit Sub Tab Change', props<ActionPayloadData<number>>());
export const updateUnitType = createAction('[Unit] Update Unit Type', props<ActionPayloadData<{ type: string; activeUnitTab: number }>>());

export const unitDetailsUpdated = createAction('[Unit] Unit Details Updated', props<ActionPayloadData<{ unitDetails: Unit; isDirty: boolean; isValid: boolean }>>());

export const deleteUnit = createAction('[Unit] Delete Unit', props<ActionPayloadData<number>>());
export const deleteUnitSuccess = createAction('[Unit] Delete Unit Success', props<ActionPayloadData<number>>());
export const deleteUnitFailure = createAction('[Unit] Delete Unit Failure');

export const deleteSubUnit = createAction('[Unit] Delete Sub Unit', props<ActionPayloadData<number>>());
export const deleteSubUnitSuccess = createAction('[Unit] Delete Sub Unit Success', props<ActionPayloadData<number>>());
export const deleteSubUnitFailure = createAction('[Unit] Delete Sub Unit Filure');

export const addAccessory = createAction('[Accessory] Add Unit Accessory', props<ActionPayloadData<UnitOption>>());
export const addAccessorySuccess = createAction('[Accessory] Add Unit Accessory Success', props<ActionPayloadData<UnitOption>>());
export const addAccessoryFailure = createAction('[Accessory] Add Unit Accessory Failure');

export const editAccessory = createAction('[Accessory] Edit Accessory', props<ActionPayloadData<UnitOption>>());
export const editAccessorySuccess = createAction('[Accessory] Edit Accessory Success', props<ActionPayloadData<UnitOption>>());
export const editAccessoryFailure = createAction('[Accessory] Edit Accessory Failure');

export const deleteAccessory = createAction('[Accessory] Delete Accessory', props<ActionPayloadData<UnitOption>>());
export const deleteAccessorySuccess = createAction('[Unit] Delete Accessory Success', props<ActionPayloadData<UnitOption>>());

export const autoSaveUnit = createAction('[Unit] Auto Save Unit', props<ActionPayloadData<{ manual: boolean; skipValidation: boolean, unitDrag: boolean }>>());
export const autoSaveSingleUnit = createAction('[Unit] Auto Save single Unit', props<ActionPayloadData<{ manual: boolean; skipValidation: boolean }>>());
export const autoSaveMultiUnit = createAction('[Unit] Auto Save Multiple Unit', props<ActionPayloadData<Unit[]>>());
export const autoSaveMultiUnitSuccess = createAction('[Unit] Auto Save Multi Unit Success', props<ActionPayloadData<Units>>());
export const autoSaveUnitSuccess = createAction('[Unit] Auto Save Unit Success', props<ActionPayloadData<Unit>>());
export const autoSaveUnitFailure = createAction('[Unit] Auto Save Unit Failure');

export const updateUnitSuccess = createAction('[Unit] Update Unit Success', props<ActionPayloadData<Unit>>());

export const updateUnits = createAction('[Unit] Update Multiple Units', props<ActionPayloadData<Unit[]>>());
export const updateUnitsSuccess = createAction('[Unit] Update Multiple Units Success', props<ActionPayloadData<boolean>>());
export const updateUnitsFailure = createAction('[Unit] Update Multiple Units Failure', props<ActionPayloadData<HttpErrorResponse[]>>());

export const setOpenRatingDialog = createAction('[Unit] Set Open Rating Dialog ', props<ActionPayloadData<boolean>>());

export const updateUnitsAfterValidate = createAction('[Unit] Update Units After Validate', props<ActionPayloadData<Unit[]>>());
export const updateUnitFormStatus = createAction('[Unit] Update Unit Form Status', props<ActionPayloadData<{ formDirty: boolean, formValid: boolean }>>());

// LS import
export const addImportUnit = createAction('[Unit] Add Unit Import', props<ActionPayloadData<ImportUnit>>());
export const addImportUnitSuccess = createAction('[Unit] Add Unit Import Success', props<ActionPayloadData<number>>());
export const addImportUnitFailure = createAction('[Unit] Add Unit Import Failure');

export const updateImportUnit = createAction('[Unit] Update Unit Import', props<ActionPayloadData<{ importUnit: ImportUnit; unitId: number }>>());
export const updateImportUnitSuccess = createAction('[Unit] Update Unit Import Success');
export const updateImportUnitFailure = createAction('[Unit] Update Unit Import Failure');

export const updateUnitsDetail = createAction('[Unit] Update Units Detail', props<ActionPayloadData<ContractUnit[]>>());

export const reorderUnits = createAction('[Unit] Re Order The Units Tab', props<ActionPayloadData<{tabs: any[], currentIndex: number}>>());


