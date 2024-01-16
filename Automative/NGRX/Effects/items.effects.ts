import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiError, ApiErrorResponse, ConfirmationDialogData, ImportUnit, StartNumOrder, Unit, UnitAge, Units, UpdateMultipleUnitsInfo } from '@app/entities';
import { EventService, LoaderService, ModalService, SnackbarMessageGroup, SnackbarService, UtilityService } from '@app/shared/services';
import { ConfirmationDialogComponent } from '@app/shared/ui';
import { AppSettings } from '@app/shared/utils';
import { AppFacade } from '@app/store/app';
import { UserFacade } from '@app/store/user';
import { catchError, concatMap, delay, filter, finalize, map, of, tap, withLatestFrom } from 'rxjs';
import { computePrimaryUnit } from '../../helpers';
import { UnitsService } from '../../services';
import * as UnitActions from '../actions';
import { DealFacade, UnitsFacade } from '../facades';
enum DuplicateCheckAction {
  NewUnit = 'NewUnit',
  AddImportUnit = 'AddImportUnit',
  UpdateImportUnit = 'UpdateImportUnit',
}
@Injectable()
export class UnitsEffects {
  getUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.getUnitsTabData),
      map((action) => action.data),
      withLatestFrom(this.unitsFacade.loaded$, this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      filter(([refersh, loaded]) => refersh || !loaded),
      concatMap(([, , orgId, dealId]) => {
        this.loaderService.showSpinner();
        if (!dealId) return of();
        return this.unitsService.getUnits(orgId, dealId).pipe(
          map((res) => {
            return UnitActions.getUnitsTabDataSuccess({ data: res });
          }),
          catchError(() => of(UnitActions.getUnitsTabDataFailure()))
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );

  getUnitsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UnitActions.getUnitsTabDataSuccess),
        map((action) => action.data),
        tap(({ units }) => {
          const unit = units.length > 0 ? units.sort((a, b) => a.numOrder - b.numOrder)[0] : null;
          this.computePrimaryUnit(unit);
        })
      ),
    { dispatch: false }
  );

  addAccessories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.addAccessory),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([payload, orgId, dealId]) => {
        return this.unitsService.addAccessory(orgId, dealId, payload).pipe(
          map((res) => {
            payload = { ...payload, id: res };
            return UnitActions.addAccessorySuccess({ data: payload });
          }),
          tap(() => {
            this.unitsFacade.getUnitsTabData(true);
          }),
          catchError(() => of(UnitActions.addAccessoryFailure()))
        );
      })
    )
  );

  editAccessories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.editAccessory),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([payload, orgId, dealId]) => {
        return this.unitsService.editAccessory(orgId, dealId, payload).pipe(
          map(() => {
            return UnitActions.editAccessorySuccess({ data: payload });
          }),
          catchError(() => of(UnitActions.editAccessoryFailure()))
        );
      })
    )
  );

  deleteAccessory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.deleteAccessory),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([data, orgId, dealId]) => {
        if (!data) {
          return [UnitActions.deleteAccessorySuccess({ data: data })];
        }

        return this.unitsService.deleteAccessory(orgId, dealId, data).pipe(
          map(() => {
            return UnitActions.deleteAccessorySuccess({ data: data });
          }),
          tap(() => {
            this.eventService.removeItemObservable.next();
          })
        );
      })
    )
  );

  autoSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.autoSaveUnit),
      withLatestFrom(this.unitsFacade.activeUnit$, this.unitsFacade.lastNumOrder$, this.unitsFacade.unitsReordered$, this.unitsFacade.units$),
      map(([{ data }, unit, lastNumOrder, unitsReordered, units]) => {
        if (unitsReordered) {
          const array: Unit[] = [];
          units.map((unit) => {
            const deliveryDate = unit.age === UnitAge.New || unit.age === UnitAge.OnOrder ? unit?.inServiceDate ?? unit?.deliveryDate : unit?.deliveryDate;
            const unitsData = { ...unit, deliveryDate: this.utilityService.formatDate(deliveryDate, 'yyyy-MM-dd') };
            delete unitsData.subUnits;
            array.push(unitsData);
            unit.subUnits?.map((subUnit) => {
              const subUnitData = { ...subUnit, deliveryDate: this.utilityService.formatDate(subUnit?.deliveryDate, 'yyyy-MM-dd') };
              array.push(subUnitData);
            });
          });
          const existingUnits = array.filter((a) => a.unitId);
          return UnitActions.autoSaveMultiUnit({ data: existingUnits });
        }
        const { manual, skipValidation } = data;
        const deliveryDate = unit.age === UnitAge.New || unit.age === UnitAge.OnOrder ? unit?.inServiceDate ?? unit?.deliveryDate : unit?.deliveryDate;
        const unitPayload = { ...unit, skipValidation, deliveryDate: this.utilityService.formatDate(deliveryDate, 'yyyy-MM-dd') };
        const subUnitsType = unitPayload.subUnitCount;
        if (subUnitsType > 1) {
          delete unitPayload.warrantyStatus;
          delete unitPayload.subUnits;
          delete unitPayload.subUnitCount;
          const arrayUnits = [];
          // Update lastNumOrder and add mupltiple units
          let newLastNumOrder = lastNumOrder;

          for (let i = 1; i <= subUnitsType; i++) {
            if (i == 1) {
              arrayUnits.push({ ...unitPayload });
              delete unitPayload.stockNo;
              delete unitPayload.vin;
              continue;
            }
            newLastNumOrder = newLastNumOrder + 1;
            unitPayload.numOrder = newLastNumOrder;
            arrayUnits.push({ ...unitPayload });
          }
          return UnitActions.autoSaveMultiUnit({ data: arrayUnits });
        } else {
          return UnitActions.autoSaveSingleUnit({ data: { manual, skipValidation } });
        }
      })
    )
  );

  autoSaveMultiUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.autoSaveMultiUnit),
      map((action) => action.data),
      withLatestFrom(this.dealFacade.dealId$, this.userFacade.user$, this.unitsFacade.unitsReordered$),
      concatMap(([data, dealId, user, unitsReordered]) => {
        this.appFacade.dataSaving();
        const updatedUnits = data?.map((u) => {
          return { ...u, skipValidation: true };
        });
        const units = {
          units: updatedUnits,
        };

        const apiCall = this.unitsService.updateUnits(user.orgId, dealId, units);
        return apiCall.pipe(
          map((unitIds) => {
            const newUnits = data.map((item, i) => Object.assign({}, item, { unitId: unitIds[i] }));

            this.appFacade.dataSaved(true);
            return UnitActions.autoSaveMultiUnitSuccess({ data: { units: newUnits } });
          }),
          tap(() => {
            if (data.length > 1 && unitsReordered) {
              this.computePrimaryUnit(data[0]);
            }
          }),
          catchError(() => of(UnitActions.autoSaveUnitFailure())),
          finalize(() => {
            setTimeout(() => {
              // Update worksheet details
              this.dealFacade.getWorksheetDetails(true);
              this.appFacade.dataSaved(false);
            }, 2000);
          })
        );
      })
    )
  );

  autoSaveSingleUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.autoSaveSingleUnit),
      withLatestFrom(this.dealFacade.dealId$, this.unitsFacade.activeUnit$, this.unitsFacade.lastNumOrder$, this.userFacade.user$),
      concatMap(([{ data }, dealId, unit, lastNumOrder, user]) => {
        const { manual, skipValidation } = data;
        const { numOrder } = unit;
        this.appFacade.dataSaving();
        // Evaluate NumOrder If NumOrder Not Exist (NumOrder will not there in case of Moter, Trailor & Generators)
        const updateMode = unit.unitId > 0;
        const deliveryDate = unit.age === UnitAge.New || unit.age === UnitAge.OnOrder ? unit?.inServiceDate ?? unit?.deliveryDate : unit?.deliveryDate;
        const unitPayload = {
          ...unit,
          skipValidation: updateMode || numOrder > 1 ? true : skipValidation,
          deliveryDate: this.utilityService.formatDate(deliveryDate, 'yyyy-MM-dd'),
        };

        if (!unit.numOrder) unitPayload.numOrder = lastNumOrder + 1;

        // Remove Sub Units property if exist
        delete unitPayload.subUnits;

        const payload: Units = {
          units: [unitPayload],
        };
        const apiCall = this.unitsService.updateUnits(user.orgId, dealId, payload, true);

        return apiCall.pipe(
          map((unitIds) => {
            const savedUnitId = unitIds.length > 0 ? unitIds[0] : unit.unitId;
            this.appFacade.dataSaved(true);

            return UnitActions.autoSaveUnitSuccess({ data: { ...unitPayload, unitId: savedUnitId } });
          }),
          tap(() => {
            // Update worksheet details
            this.dealFacade.getWorksheetDetails(true);

            // Only update details if primary unit changed
            if (unit.numOrder == StartNumOrder.Unit) {
              this.computePrimaryUnit(unit);
            }
          }),
          catchError((error) => {
            this.checkDuplicateUnit(error, DuplicateCheckAction.NewUnit, manual);
            return of(UnitActions.autoSaveUnitFailure());
          }),
          finalize(() => {
            setTimeout(() => {
              this.appFacade.dataSaved(false);
            }, 2000);
          })
        );
      })
    )
  );

  deleteUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.deleteUnit),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.unitsFacade.units$),
      concatMap(([tabIndex, orgId, dealId, units]) => {
        const { unitId } = units[tabIndex];
        if (!unitId) {
          return [UnitActions.deleteUnitSuccess({ data: tabIndex })];
        }

        return this.unitsService.deleteUnit(orgId, dealId, unitId).pipe(
          map(() => {
            return UnitActions.deleteUnitSuccess({ data: tabIndex });
          }),
          tap(() => {
            // Update worksheet details
            this.dealFacade.getWorksheetDetails(true);
            // Only update details if primary unit deleted
            if (tabIndex == 0) {
              const unit = units.length > 0 ? units[tabIndex + 1] : null;
              this.computePrimaryUnit(unit);
            }
          }),
          catchError(() => of(UnitActions.deleteUnitFailure()))
        );
      }),
      tap(() => {
        this.eventService.removeItemObservable.next();
      })
    )
  );

  deleteSubUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.deleteSubUnit),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.unitsFacade.units$, this.unitsFacade.activeUnitTab$),
      concatMap(([data, orgId, dealId, units, activeTab]) => {
        const subUnits = units[activeTab].subUnits;
        const { unitId } = subUnits[data];
        if (!unitId) {
          return [UnitActions.deleteSubUnitSuccess({ data: data })];
        }

        return this.unitsService.deleteUnit(orgId, dealId, unitId).pipe(
          map(() => {
            return UnitActions.deleteSubUnitSuccess({ data: data });
          }),
          tap(() => {
            // Update worksheet details
            this.dealFacade.getWorksheetDetails(true);
          }),
          catchError(() => of(UnitActions.deleteSubUnitFailure()))
        );
      }),
      tap(() => {
        this.eventService.removeItemObservable.next();
      })
    )
  );

  updateUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UnitActions.updateUnits),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([units, orgId, dealId]) => {
        this.loaderService.showSpinner();
        const updatedUnits = units.map((u) => {
          return { ...u, skipValidation: true, deliveryDate: this.utilityService.formatDate(u.deliveryDate, 'yyyy-MM-dd') };
        });
        this.loaderService.showSpinner();
        const payload: UpdateMultipleUnitsInfo = {
          units: updatedUnits,
        };
        return this.unitsService.updateUnits(orgId, dealId, payload, true).pipe(
          map((res) => {
            this.unitsFacade.updateUnitsAfterValidate(units);
            return UnitActions.updateUnitsSuccess({ data: res.length > 0 });
          }),

          catchError((err) => of(UnitActions.updateUnitsFailure(err)))
        );
      })
    );
  });

  updateDealAmount$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UnitActions.addAccessorySuccess, UnitActions.editAccessorySuccess, UnitActions.deleteAccessorySuccess),
        tap(() => {
          this.dealFacade.getWorksheetDetails(true);
        })
      ),
    { dispatch: false }
  );

  updateUnitsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UnitActions.updateUnitsSuccess),
        map((action) => action.data),
        tap((result) => {
          this.loaderService.hideSpinner();

          if (result) {
            this.unitsFacade.setOpenRatingDialog(true);

            setTimeout(() => this.unitsFacade.setOpenRatingDialog(false), 100);
          }
        })
      ),
    { dispatch: false }
  );

  updateUnitsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UnitActions.updateUnitsFailure),
        map((action) => action.data),
        tap((result) => {
          this.loaderService.hideSpinner();

          const messageGroups: SnackbarMessageGroup[] = [];
          let errorResponse: ApiErrorResponse;
          result.forEach((err, i) => {
            errorResponse = err.error;
            const errors = errorResponse.errors || {};
            let messages: string[] = [];
            for (const field in errors) {
              messages = messages.concat(errors[field].map((message) => field + ': ' + message));
            }
            messageGroups.push({
              titleKey: `Unit ${i + 1}`,
              messages: messages,
            });
          });

          this.snackbarService.multipleErrors({
            title: 'common.error',
            messageGroups: messageGroups,
          });
        })
      ),
    { dispatch: false }
  );

  // LS Import
  addImportUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.addImportUnit),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.unitsFacade.activeUnitTab$),
      concatMap(([data, orgId, dealId, activeUnitTab]) => {
        const { skipValidation } = data;
        const updatedData = { ...data, skipValidation: skipValidation || activeUnitTab > 0 };
        const hideErrorSnackbar = true;
        return this.unitsService.addImportUnit(orgId, dealId, updatedData, hideErrorSnackbar).pipe(
          map((unitId) => {
            this.dealFacade.getDeal(dealId);
            return UnitActions.addImportUnitSuccess({ data: unitId });
          }),
          catchError((error) => {
            this.checkDuplicateUnit(error, DuplicateCheckAction.AddImportUnit, false, updatedData);
            return of(UnitActions.addImportUnitFailure());
          })
        );
      })
    )
  );

  updateImportUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UnitActions.updateImportUnit),
      delay(AppSettings.savingDelay),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.unitsFacade.activeUnitTab$),
      concatMap(([data, orgId, dealId, activeUnitTab]) => {
        const hideErrorSnackbar = true;
        const { importUnit, unitId } = data;
        const { skipValidation } = importUnit;
        const updatedImportUnit = { ...importUnit, skipValidation: skipValidation || activeUnitTab > 0 };
        return this.unitsService.updateImportUnit(orgId, dealId, unitId, updatedImportUnit, hideErrorSnackbar).pipe(
          map(() => {
            this.dealFacade.getDeal(dealId);
            return UnitActions.updateImportUnitSuccess();
          }),
          catchError((error) => {
            this.checkDuplicateUnit(error, DuplicateCheckAction.UpdateImportUnit, false, { ...updatedImportUnit, unitId });
            return of(UnitActions.addImportUnitFailure());
          })
        );
      })
    )
  );
  private computePrimaryUnit(unit: Unit) {
    if (unit) {
      const primaryUnit = computePrimaryUnit(unit);
      this.dealFacade.updatePrimaryUnit(primaryUnit);
    } else {
      this.dealFacade.updatePrimaryUnit(null);
    }
  }

  private checkDuplicateUnit = (error: ApiError, action: DuplicateCheckAction, manual = false, payloadData?: ImportUnit) => {
    if (error) {
      const { unitId } = payloadData || {};
      const { hasErrors, errorKeyExist, message } = this.utilityService.checkApiError(error.error, 'DuplicateDealUnit');
      this.eventService.backgroundCallCompletedObservable.next(true);
      if (hasErrors) {
        if (errorKeyExist) {
          this.unitsFacade.updateUnitFormStatus(false, true);
          const modalData: ConfirmationDialogData = {
            title: message,
            button: {
              primaryButton: 'common.yes',
              secondaryButton: 'common.no',
            },
          };
          const dialogRef = this.modalService.open(ConfirmationDialogComponent, modalData, 'modal-sm');
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              switch (action) {
                case DuplicateCheckAction.NewUnit:
                  this.unitsFacade.unitSave(manual, true);
                  this.unitsFacade.updateUnitFormStatus(result, true);

                  break;
                case DuplicateCheckAction.AddImportUnit:
                  this.unitsFacade.addImportUnit({ ...payloadData, skipValidation: true });

                  break;
                case DuplicateCheckAction.UpdateImportUnit:
                  this.unitsFacade.updateImportUnit({ ...payloadData, skipValidation: true }, unitId);
                  break;

                default:
                  break;
              }
            }
          });
        } else {
          // Showing handled errors
          this.snackbarService.error(message);
        }
      }
    }
  };

  constructor(
    private readonly actions$: Actions,
    private unitsService: UnitsService,
    private snackbarService: SnackbarService,
    private userFacade: UserFacade,
    private dealFacade: DealFacade,
    private unitsFacade: UnitsFacade,
    private loaderService: LoaderService,
    private eventService: EventService,
    private modalService: ModalService,
    private utilityService: UtilityService,
    private appFacade: AppFacade
  ) {}
}
