import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { CustomerType, DealType, EntityType, Note, Permission, ProviderCode, WorksheetDetails } from '@app/entities';
import { DealAction } from '@app/shared/components';
import { IdPipe } from '@app/shared/pipes';
import { LoaderService, ModalService, SnackbarService, StorageService, UtilityService } from '@app/shared/services';
import { StorageKeys } from '@app/shared/utils';
import { FreshDeskService, PermissionService, TaxFacade, UserFacade } from '@app/store/user';
import { catchError, concatMap, exhaustMap, finalize, map, of, tap, withLatestFrom } from 'rxjs';
import { VoidContractErrorsDialogComponent } from '../../components';
import { DealLender } from '../../models';
import { DealService } from '../../services';
import * as DealActions from '../actions';
import * as DealManagementActions from '../actions';
import { CustomerFacade, DealFacade, NotesFacade, TradeInFacade, UnitsFacade, WorksheetFacade } from '../facades';

@Injectable()
export class CommonEffects {
  newDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.newDeal),
      withLatestFrom(this.userFacade.currentOrgId$, this.userFacade.userName$),
      concatMap(([, orgId, userName]) => {
        const isLocked = !this.permissionService.permissionIsGranted(Permission.UpdateDeal);
        const defaultDeal = {
          id: 0,
          orgId: orgId,
          salesPerson: userName,
          dealType: DealType.Finance,
          createDateTimeUtc: this.utilityService.currentDateTimeUTC(),
          lastUpdateDateTimeUtc: this.utilityService.currentDateTimeUTC(),
          isLocked,
          customerInfo: {
            customerType: CustomerType.Individual,
            customers: [],
          },
          lenderInfo: new DealLender(),
          unitInfo: {
            units: [],
            options: [],
          },
          worksheet: new WorksheetDetails(),
          tradeIns: [],
          docsCount: 0,
          notesCount: 0,
        };

        return of(DealActions.getDealSuccess({ data: defaultDeal }));
      })
    )
  );

  getDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.getDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([dealId, orgId]) => {
        return this.dealService.getDealDetails(orgId, dealId).pipe(
          map((res) => {
            const isLocked = res.isLocked || !this.permissionService.permissionIsGranted(Permission.UpdateDeal);
            const data = { ...res, isLocked };
            return DealActions.getDealSuccess({ data });
          }),
          catchError(() => of(DealActions.getDealFailure()))
        );
      })
    )
  );

  getDealSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DealActions.getDealSuccess),
        map((action) => action.data),
        withLatestFrom(this.userFacade.userViewModel$),
        tap(([data, user]) => {
          const { id, orgId, sessionId } = user;
          const dealId = data.id;

          this.customerFacade.getCustomersSuccess(data.customerInfo);
          this.tradeInFacade.getTradeInsSuccess(data.tradeIns);
          this.unitsFacade.getUnitsTabDataSuccess(data.unitInfo);
          this.worksheetFacade.getWorksheetDetailsSuccess(data.worksheet);
          this.freshDeskService.setCustomFields(id, orgId, sessionId, dealId);
        })
      ),
    { dispatch: false }
  );

  getCustomerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DealActions.getCustomersSuccess),
        withLatestFrom(this.dealFacade.primaryCustomerAddress$),
        tap(([, customerAddress]) => {
          this.taxFacade.getCustomerTaxRates(customerAddress);
        })
      ),
    { dispatch: false }
  );

  updateContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.updateContacts),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([payload, orgId, dealId]) => {
        return this.dealService.updateContacts(orgId, dealId, payload).pipe(
          map(() => {
            return DealActions.updateContactsSuccess({ data: payload });
          }),
          catchError(() => of(DealActions.updateContactsFailure()))
        );
      })
    )
  );

  resetEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DealActions.resetEvent),
        tap(() => {
          this.storageService.remove(StorageKeys.FormInvalid, true);
          this.storageService.remove(StorageKeys.FormDirty, true);
        })
      ),
    { dispatch: false }
  );

  updateDealTabUnLocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.updateDealTabUnLocks),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([payload, orgId, dealId]) => {
        return this.dealService.updateDealTabUnLocks(orgId, dealId, payload).pipe(
          map((res) => {
            return DealActions.updateDealTabUnLocksSuccess({ data: { ...res, currentTab: payload } });
          }),
          tap(() => {
            this.dealFacade.unlockEvent();
            this.dealFacade.updateNotes();
            this.notesFacade.getNotes(new Note(true));
          }),
          catchError(() => of(DealActions.updateDealTabUnLocksFailure()))
        );
      })
    )
  );

  updateDealTabUnLocksSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DealActions.updateDealTabUnLocksSuccess),
        map((action) => action.data),
        tap((data) => {
          const { isVoidSuccess, errors } = data;
          if (isVoidSuccess) return;

          setTimeout(() => {
            this.modalService.open(
              VoidContractErrorsDialogComponent,
              errors.map((d) => d.errorMessage),
              'modal-md'
            );
          }, 0);
        })
      ),
    { dispatch: false }
  );

  createCloneDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.createCloneDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        const { dealId } = payload;
        this.loaderService.showSpinner();
        return this.dealService.createCloneDeal(orgId, dealId, payload).pipe(
          map((res) => {
            this.utilityService.navigationWithReloadRoute(`/deals/${res}/customers`);
            return DealActions.createCloneDealSuccess({ data: res });
          }),
          catchError(() => of(DealActions.createCloneDealFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  deleteDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.deleteDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        const { dealId } = payload;
        this.loaderService.showSpinner();
        return this.dealService.deleteDeal(orgId, dealId, payload).pipe(
          map(() => {
            this.utilityService.navigationWithReloadRoute(`/deals`);
            const message = this.translateService.instant('deal.common.dealDelete', { dealId: `(D-${dealId})` });
            this.snackbarService.success(message);
            return DealManagementActions.deleteDealSuccess({ data: dealId });
          }),
          catchError(() => of(DealActions.deleteDealFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  markDeadDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.markDeadDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        const { dealId } = payload;
        this.loaderService.showSpinner();
        return this.dealService.markDeadDeal(orgId, dealId, payload).pipe(
          map(() => {
            this.utilityService.navigationWithReloadRoute(`/deals`);
            const dealDeadMessages = this.translateService.instant('deal.common.dealDead', { dealId: `(D-${dealId})` });
            this.snackbarService.success(dealDeadMessages);
            return DealActions.markDeadDealSuccess({ data: dealId });
          }),
          catchError(() => of(DealActions.markDeadDealFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  dmsRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.dmsRefresh),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([dealId, orgId]) => {
        this.loaderService.showSpinner();

        return this.dealService.dmsRefresh(orgId, dealId).pipe(
          map(() => {
            this.utilityService.navigationWithReloadRoute(`/deals/${dealId}/customers`);
            return DealActions.dmsRefreshSuccess({ data: dealId });
          }),
          catchError(() => {
            of(DealActions.dmsRefreshFailure());
            return of();
          })
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );

  dmsUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.dmsUpdate),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([dealId, orgId]) => {
        this.loaderService.showSpinner();
        return this.dealService.dmsUpdate(orgId, ProviderCode.Lightspeed, dealId).pipe(
          map(() => {
            const messages = this.translateService.instant('deal.common.dmsUpdate');
            this.snackbarService.success(messages);
            return DealActions.dmsUpdateSuccess();
          }),
          catchError(() => of(DealActions.dmsUpdateFailure()))
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );

  closeDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.closeDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        const { dealId, state } = payload;
        this.loaderService.showSpinner();
        return this.dealService.closeDeal(orgId, dealId, state).pipe(
          map(() => {
            this.utilityService.navigationWithReloadRoute(`/deals`);
            const closeDeal = this.translateService.instant('deal.common.closeDeal', { dealId: `(D-${dealId})` });
            this.snackbarService.success(closeDeal);
            return DealManagementActions.closeDealSuccess({ data: dealId });
          }),
          catchError(() => of(DealActions.closeDealFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  blockUnblockDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.blockUnblockDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        const { dealId, state } = payload;
        this.loaderService.showSpinner();
        const service = state == DealAction.Active ? this.dealService.unblockDeal(orgId, dealId, payload) : this.dealService.blockDeal(orgId, dealId, payload);
        return service.pipe(
          map(() => {
            this.utilityService.navigationWithReloadRoute(`/deals`);
            const prefix = EntityType.Deal;
            const id = this.idPipe.transform(dealId, prefix);
            const successMessages = this.translateService.instant('deal.common.' + (state == DealAction.Active ? 'unBlocked' : 'blockDead'), {
              dealId: id,
            });
            this.snackbarService.success(successMessages);
            return DealActions.blockUnblockDealSuccess({ data: dealId });
          }),
          catchError(() => of(DealActions.blockUnblockDealFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  dmsPushDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.dmsPushDeal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        const { dealId } = payload;

        const hideErrorSnackbar = true;
        this.loaderService.showSpinner();
        return this.dealService.dmsPushDeal(orgId, dealId, payload, hideErrorSnackbar).pipe(
          map((res) => {
            this.snackbarService.success('deal.common.dmsPush');
            return DealManagementActions.dmsPushDealSuccess({ data: res });
          }),
          catchError((error) => {
            if (error.status === 201) {
              this.dealFacade.updateNotes();
            }
            return of();
          }),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private dealFacade: DealFacade,
    private taxFacade: TaxFacade,
    private customerFacade: CustomerFacade,
    private unitsFacade: UnitsFacade,
    private worksheetFacade: WorksheetFacade,
    private tradeInFacade: TradeInFacade,
    private dealService: DealService,
    private loaderService: LoaderService,
    private storageService: StorageService,
    private utilityService: UtilityService,
    private snackbarService: SnackbarService,
    private userFacade: UserFacade,
    private modalService: ModalService,
    private permissionService: PermissionService,
    private freshDeskService: FreshDeskService,
    private notesFacade: NotesFacade,
    private translateService: TranslateService,
    private idPipe: IdPipe
  ) {}
}
