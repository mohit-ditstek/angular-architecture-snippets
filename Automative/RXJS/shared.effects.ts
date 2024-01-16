import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoaderService, ModalService, SnackbarService, UtilityService } from '@app/shared/services';
import { UserFacade } from '@app/store/user';
import { catchError, concatMap, finalize, map, of, tap, withLatestFrom } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogData, EntityType, StageType } from '@app/entities';
import { SharedService } from '../api';
import * as SharedActions from './shared.actions';
import { ConfirmationDialogComponent } from '@app/shared/ui';
import { SharedFacade } from './shared.facade';
import { IdPipe } from '@app/shared/pipes';

@Injectable()
export class SharedEffects {
  constructor(
    private readonly actions$: Actions,
    private snackbarService: SnackbarService,
    private utilityService: UtilityService,
    private loaderService: LoaderService,
    private userFacade: UserFacade,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private modalService: ModalService,
    private sharedFacade:SharedFacade,
    private idPipe: IdPipe
  ) {}

  initiateapp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.initiateapp),
        map((action) => action.data),
        withLatestFrom(this.userFacade.currentOrgId$),
        concatMap(([payload, orgId]) => {
          this.loaderService.showSpinner();

          return this.sharedService.initiateapp(orgId, payload).pipe(
            map((appId) => {
              if (payload.customerEmail || payload.customerMobilePhone) {
                let message = '';
                switch (payload.type) {
                  case StageType.lead:
                    message = this.translateService.instant('app.successMessages.linkSentLead', { id: `(${this.idPipe.transform(payload.customerId, EntityType.Lead)})` });
                    break;
                  case StageType.customer:
                    message = this.translateService.instant('app.successMessages.linkSentCustomer', { id: `(${this.idPipe.transform(payload.customerId, EntityType.Customer)})` });
                    break;
                  case StageType.quote:
                    message = this.translateService.instant('app.successMessages.linkSentQuote', { id: `(${this.idPipe.transform(payload.dealId, EntityType.Quote)})` });
                    break;
                  case StageType.deal:
                    message = this.translateService.instant('app.successMessages.linkSentDeal', { id: `(${this.idPipe.transform(payload.dealId, EntityType.Deal)})` });
                    break;
                  default:
                    message = this.translateService.instant('app.successMessages.linkSent');
                    break;
                }
                this.snackbarService.success(message);
              } else {
                const appUrl = this.utilityService.buildappUrl(orgId, appId, payload.stockNo);
                window.open(appUrl, '_blank');
              }
            }),
            finalize(() => {
              this.loaderService.hideSpinner();
            })
          );
        })
      ),
    { dispatch: false }
  );

  getDealContactInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.getDealContactInfo),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        this.loaderService.showSpinner();
        return this.sharedService.getDealContactInfo(orgId, payload).pipe(
          map((res) => {
            return SharedActions.getDealContactInfoSuccess({ data: res });
          }),
          catchError(() => of(SharedActions.getDealContactInfoFailure())),
          finalize(() => {
            this.loaderService.hideSpinner();
          })
        );
      })
    )
  );
  getappContactInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.getappContactInfo),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        this.loaderService.showSpinner();
        return this.sharedService.getappContactInfo(orgId, payload).pipe(
          map((res) => {
            return SharedActions.getappContactInfoSuccess({ data: res });
          }),
          catchError(() => of(SharedActions.getappContactInfoFailure())),
          finalize(() => {
            this.loaderService.hideSpinner();
          })
        );
      })
    )
  );

  checkstNumberExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.checkstNumberExists),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        this.loaderService.showSpinner();
        if (!payload.stockNo) {
          return of(SharedActions.initiateapp({ data: payload }));
        }
        return this.sharedService.checkstNumberExists(orgId, payload.stockNo).pipe(
          map((id:Number) => {
            if (id > 0) {
              return SharedActions.checkstNumberExistsSuccess({ data: { appData: payload, appId: id } });
            } 
            else return(SharedActions.initiateapp({ data: payload }));
          }),
          catchError(() => of(SharedActions.checkstNumberExistsFailure())),
          finalize(() => {
            this.loaderService.hideSpinner();
          })
        );
      })
    )
  );

  handleConfirmationDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SharedActions.checkstNumberExistsSuccess),
        map((action) => action.data),
        tap((payload) => {
        const { appData } = payload;
          const title = this.translateService.instant(`app.confirmationMessage.sendToCustomer`, {
            appId: this.idPipe.transform(payload.appId, EntityType.app),
            stockNo: appData.stockNo,
          });
          const modalData: ConfirmationDialogData = {
            title,
            button: {
              primaryButton: 'common.yes',
              secondaryButton: 'common.no',
            },
          };

          const dialogRef = this.modalService.open(ConfirmationDialogComponent, modalData, 'modal-sm');
           dialogRef.afterClosed().subscribe((isConfirm) => {
              if (isConfirm) this.sharedFacade.initiateapp(payload.appData);
              else dialogRef.close();
            }
          );
        })
      ),
    { dispatch: false }
  );

  getImportSearchResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SharedActions.getImportSearchResult),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([data, orgId]) => {
        return this.sharedService.importSearchResults(orgId, data).pipe(
          map((payload) => {
            return SharedActions.getImportSearchResultSuccess({ data: payload });
          }),
          catchError(() => of(SharedActions.getImportSearchResultFailure()))
        );
      })
    )
  );
}
