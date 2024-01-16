import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, finalize, map, of, tap, withLatestFrom } from 'rxjs';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserAction, ColumnType } from '@app/entities';
import { EventService, LoaderService, SnackbarMessageGroup, SnackbarService } from '@app/shared/services';
import { AppFacade } from '@app/store/app';
import { UserFacade } from '@app/store/user';
import { userService } from '../api';
import { userFeature, userFeatureRequest } from '../models';
import * as userActions from './user.actions';
import { userFacade } from './user.facade';

@Injectable()
export class userEffects {
  getuser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getuser),
      map((action) => action.data),
      withLatestFrom(this.userFacade.loaded$, this.userFacade.currentuserId$, this.appFacade.currentRouteState$),
      filter(([, loaded]) => !loaded),
      concatMap(([data, , currentuserId, routeState]) => {
        const { id, userId } = routeState?.params || {};
        const routeHasuserId = Number(userId) > 0;
        const computeduserId = routeHasuserId ? userId : currentuserId;
        const detailsId = id || data;
        this.loaderService.showSpinner();

        return this.userService.getuser(computeduserId, detailsId).pipe(
          map((res) => {
            return userActions.getuserSuccess({
              data: {
                user: res,
                detailsId: detailsId,
                userId: computeduserId,
                isLoggedIn: routeHasuserId,
              },
            });
          }),
          catchError(() => of(userActions.getuserFailure())),
          finalize(() => this.loaderService.hideSpinner())
        );
      })
    )
  );

  userUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userUpdated),
      map((action) => action.data),
      withLatestFrom(this.userFacade.isLoggedIn$, this.userFacade.currentuserId$, this.appFacade.currentRouteState$),
      concatMap(([data, isLoggedIn, currentuserId, routeState]) => {
        const { id, userId } = routeState?.params || {};
        const routeHasuserId = Number(userId) > 0;
        const computeduserId = routeHasuserId ? userId : currentuserId;
        const { action } = data;
        let redirectUrl;
        switch (action) {
        case UserAction.userAccepted:
          redirectUrl = isLoggedIn ? `/users/${computeduserId}/details/${id}/user/thankyou` : `details/${id}/user/thankyou`;
          break;

        case UserAction.user: {
          const isConfirmation = routeState.url.includes('confirm');
          if (isConfirmation) redirectUrl = isLoggedIn ? `/users/${computeduserId}/details/${id}/user` : `details/${id}/user`;
          break;
        }

        case UserAction.userConfirmation:
          redirectUrl = this.router.url + '/confirm';
          break;
        }

        this.userFacade.viewUpdating(true);

        return this.userService.getuser(computeduserId, id).pipe(
          map((res) => {
            if (action === UserAction.userAccepted) {
              return userActions.updateuserSuccess({
                data: { user: res, detailsId: id },
              });
            }
            return userActions.getuserSuccess({
              data: {
                user: res,
                detailsId: id,
                userId: computeduserId,
                isLoggedIn: routeHasuserId,
              },
            });
          }),
          tap(() => {
            if (redirectUrl)
              this.router.navigateByUrl(redirectUrl, {
                state: { docId: data.payload, userId: computeduserId },
              });
          }),
          catchError(() => of(userActions.getuserFailure())),
          finalize(() => this.userFacade.viewUpdating(false))
        );
      })
    )
  );

  toggleColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleColumn),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$, this.userFacade.vm$),
      map(([data, connectionId, userRequest]) => {
        const { columns } = userRequest;
        const standardColumns = columns.filter((column)=> !column.isRecommended && column.isVisible);
        const isStandardColumnsLocked = standardColumns.every((column)=> column.isLocked);
        const columnProducts = columns.find((x) => x.name === data.columnName)?.products;
        const updatedColumns: userFeature[] = [
          {
            name: data.columnName,
            isVisible: data.isVisible,
            isSelected: false,
            isCustom: false,
            selectedTerm: 0,
            products: columnProducts || [],
            isLocked: isStandardColumnsLocked,
          },
        ];
        const payload: userFeatureRequest = {
          columns: updatedColumns,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleCustomColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleCustomColumn),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const columns: userFeature[] = [
          {
            name: ColumnType.CustomProtection,
            isVisible: data,
            isSelected: false,
            isCustom: true,
            selectedTerm: 0,
            products: [],
          },
        ];

        const payload: userFeatureRequest = {
          columns: columns,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  updatecalculationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updatecalculationDetails),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const { detailsType, deliveryDate, totalDownPayment, basePaymentTerms, isUpdateDeposit } = data;
        const payload: userFeatureRequest = {
          calculation: {
            detailsType,
            deliveryDate,
            totalDownPayment: totalDownPayment,
            terms: basePaymentTerms,
            isUpdateDeposit,
          },
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  updateRatedProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updateRatedProduct),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const payload: userFeatureRequest = {
          product: data,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  selectFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.selectColumn),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const payload: userFeatureRequest = {
          columns: data,
          isSelected: true,
          clientConnectionId: connectionId,
          UserAction: UserAction.userConfirmation,
        };
        this.userFacade.selectedColumn(payload);
        return userActions.updateuser({ data: payload });
      })
    )
  );

  removeCustomFeature$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.removeCustomProduct),
      map((action) => action.data),
      withLatestFrom(this.userFacade.ids$, this.userFacade.vm$, this.userFacade.connectionId$),
      concatMap(([data, { detailsId, userId }, userRequest, connectionId]) => {
        const product = [];
        const { columns } = userRequest;
        const customColumn = columns.find((x) => x.name === data.columnName);
        const index = customColumn.products.findIndex((x) => x.detailsProductId === data.detailsProductId);
        const array = [...customColumn.products];

        if (index > -1) array.splice(index, 1);

        array.forEach((element) => {
          product.push({
            detailsProductId: element.detailsProductId,
            order: element.order,
          });
        });

        const userFeatures: userFeature[] = [
          {
            name: data.columnName,
            isVisible: true,
            isSelected: false,
            isCustom: true,
            selectedTerm: 0,
            products: product,
          },
        ];
        const payload: userFeatureRequest = {
          columns: userFeatures,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };

        return this.userService.updateuser(userId, detailsId, payload).pipe(
          map((res) => {
            return userActions.updateuserSuccess({
              data: { user: res, detailsId: detailsId },
            });
          }),
          catchError(() => of(userActions.updateuserFailure()))
        );
      })
    )
  );

  addCustomProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.addCustomProduct),
      map((action) => action.data),
      withLatestFrom(this.userFacade.vm$, this.userFacade.connectionId$),
      concatMap(([data, , connectionId]) => {
        const userFeatures: userFeature[] = [];
        userFeatures.push(data);
        const payload: userFeatureRequest = {
          columns: userFeatures,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };

        return of(userActions.updateuser({ data: payload }));
      })
    )
  );

  updateuser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updateuser),
      map((action) => action.data),
      withLatestFrom(this.userFacade.ids$, this.userFacade.userFeatures$),
      concatMap(([data, { detailsId, userId }, userFeatures]) => {
        const isBackgroundCall = data.columns?.length > 0 && data.columns?.findIndex((c) => c.isSelected) === -1;
        
        // Passing columns as its required to calculate additional down payment
        const columns = data.columns?.length > 0 ? data.columns : userFeatures;

        const request = {
          ...data,
          columns: [...columns],
        };

        return this.userService.updateuser(userId, detailsId, request, isBackgroundCall).pipe(
          map((res) => {
            let messageKey;
            const { isGapReRated, ratingErrors } = res;
            if (data.product) {
              messageKey = 'details.calculation.protectionProducts.successMessages.productUpdatedSuccessfully';
            } else if (ratingErrors?.length > 0) {
              const messageGroups: SnackbarMessageGroup[] = [];
              const message = 'user.errorMessage.notUpdatedGapProductTerm';

              messageGroups.push({
                titleKey: '',
                messages: [message],
              });
              this.snackbarService.multipleErrors({
                title: 'common.ratingError',
                messageGroups,
              });
            } else if (data.isSelected) {
              const column = data.columns[0];
              const showGAPPrompt = (column.paymentTerms && column.paymentTerms.length > 0) ? column.paymentTerms.find(pt => pt.term == column.selectedTerm).showGAPPrompt: false;
              if (isGapReRated && showGAPPrompt) {
                const selectedTerm = column.selectedTerm;
                messageKey = this.translateService.instant('user.successMessage.gapUpdatedSuccessfully', { term: selectedTerm });
              }
              this.router.navigateByUrl(this.router.url + '/confirm');
            }
            if (messageKey) this.snackbarService.success(messageKey);
            return userActions.updateuserSuccess({
              data: { user: res, detailsId: detailsId },
            });
          }),
          catchError(() => of(userActions.updateuserFailure()))
        );
      })
    )
  );

  toggleRecommendedColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleRecommendedColumn),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const recommendedColumn = user.columns.find((column) => column.isRecommended);
        const columns: userFeature[] = [
          {
            ...recommendedColumn,
            isLocked: !recommendedColumn.isLocked,
          },
        ];
        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          columns,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleStandardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleStandardColumn),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const columns: userFeature[] = (user.columns || []).map(column => {
          if (!column.isRecommended)
            return { ...column, isLocked: !column.isLocked };
          return column;
        });

        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          columns,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  getProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getProductDetails),
      map((action) => action.data),
      withLatestFrom(this.userFacade.ids$),
      concatMap(([detailsProductId, { userId, detailsId }]) => {
        this.loaderService.showSpinner();
        return this.userService.getProductDetails(userId, detailsId, detailsProductId).pipe(
          map((res) => {
            return userActions.getProductdetailsuccess({ data: res });
          }),
          catchError(() => of(userActions.getProductDetailsFailure()))
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );

  userProductsApproval$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userProductsApproval),
      map((action) => action.data),
      withLatestFrom(this.userFacade.ids$, this.userFacade.connectionId$),
      concatMap(([data, ids, connectionId]) => {
        const { userId, detailsId } = ids;
        const payload = { ...data };
        payload.clientConnectionId = connectionId;

        return this.userService.productsApproval(userId, detailsId, payload).pipe(
          map((docId: number) =>
            userActions.userProductsApprovalSuccess({
              data: { ...data, docId },
            })
          ),
          catchError(() => of(userActions.userProductsApprovalFailure()))
        );
      })
    )
  );

  userProductsApprovalSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.userProductsApprovalSuccess),
        map((action) => action.data),
        withLatestFrom(this.userFacade.ids$, this.userFacade.isLoggedIn$),
        tap(([data, ids, isLoggedIn]) => {
          const { docId } = data;
          const { userId, detailsId } = ids;
          const url = isLoggedIn ? `/users/${userId}/details/${detailsId}/user/thankyou` : `details/${detailsId}/user/thankyou`;
          this.router.navigateByUrl(url, {
            state: { docId: docId, userId: userId },
          });
        })
      ),
    { dispatch: false }
  );

  copyOrMoveProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.copyOrMoveProduct),
      map((action) => action.data),
      withLatestFrom(this.userFacade.ids$, this.userFacade.vm$, this.userFacade.connectionId$),
      concatMap(([data, { userId, detailsId }, userRequest, connectionId]) => {
        const product = [];
        const { columns } = userRequest;
        const column = columns.find((x) => x.name === data.columnToCopyOrMove);
        const array = [...column.products];

        array.forEach((element) => {
          product.push({
            detailsProductId: element.detailsProductId,
            order: element.order,
          });
        });

        product.push({
          detailsProductId: data.product.detailsProductId,
          order: array.length + 1,
        });
        const userFeatures: userFeature[] = [
          {
            name: column.name,
            isVisible: column.isVisible,
            isSelected: false,
            isCustom: column.isCustom,
            selectedTerm: 0,
            products: product,
          },
        ];

        const payload: userFeatureRequest = {
          columns: userFeatures,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };

        return this.userService.updateuser(userId, detailsId, payload).pipe(
          map((res) => {
            return userActions.updateuserSuccess({
              data: { user: res, detailsId: detailsId },
            });
          }),
          catchError(() => of(userActions.updateuserFailure()))
        );
      })
    )
  );

  addColumnProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.addColumnProduct),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const payload: userFeatureRequest = {
          columns: data,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  validateCompletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.validateCompletion),
        map((action) => action.data),
        withLatestFrom(this.userFacade.loaded$, this.appFacade.currentRouteState$),
        filter(([refresh, loaded]) => refresh || !loaded),
        map(([, , routeState]) => {
          const { params } = routeState;
          const { id, userId } = params;
          const isLoggedIn = Number(userId) > 0;
          this.router.navigateByUrl(isLoggedIn ? `/users/${userId}/details/user/pairing` : `/details/${id}/calculation`);
        })
      ),
    { dispatch: false }
  );

  // Decline all products and pass custom protection in columns array
  declineAlluserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.declineAlluserDetails),
      map((action) => action),
      withLatestFrom(this.userFacade.connectionId$, this.userFacade.vm$),
      map(([, connectionId, data]) => {
        const { columns, calculation } = data;
        const customColumn = columns.find((column) => column.isCustom);
        const term = (calculation.basePaymentTerms || []).find((term) => term.isSelected)?.term;

        const column: userFeature = {
          name: customColumn.name,
          isVisible: false,
          isSelected: true,
          isCustom: true,
          selectedTerm: term,
          products: [],
        };

        const payload: userFeatureRequest = {
          columns: [column],
          isSelected: true,
          clientConnectionId: connectionId,
          UserAction: UserAction.userConfirmation,
        };
        this.userFacade.selectedColumn(null);
        return userActions.updateuser({ data: payload });
      })
    )
  );

  canceluserConfirmation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.canceluserConfirmation),
      map((action) => action),
      withLatestFrom(this.userFacade.connectionId$),
      map(([ connectionId]) => {
        const payload = { connectionId, UserAction: UserAction.user };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  // Set column as recommended
  recommendeduser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.changeRecommendedColumn),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$, this.userFacade.userFeatures$),
      map(([data, connectionId, columnData]) => {
        const standardColumn = columnData.find((column) => column.name === data.columnName);
        const recommendedColumn = columnData.find((column) => column.isRecommended);
        const checkStandardLocked = columnData.filter((column) => !column.isRecommended && column.isVisible && !column.isCustom);
        const lockedNoneColumn = checkStandardLocked.every((columns) => columns.isLocked);

        const columns: userFeature[] = [];

        if (recommendedColumn) {
          columns.push({
            ...recommendedColumn,
            isLocked: standardColumn ? standardColumn?.isLocked : lockedNoneColumn,
          });
        }

        if (standardColumn) {
          columns.push({
            ...standardColumn,
            isLocked: recommendedColumn?.isLocked,
          });
        }

        const { columnName, updateRecommendedColumn } = data;
        const payload: userFeatureRequest = {
          recommendedColumnName: columnName,
          updateRecommendedColumn,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
          columns,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  // Allows selection/un-selection of products on user confirmation
  moveProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.moveProduct),
      withLatestFrom(this.userFacade.vm$, this.userFacade.connectionId$),
      concatMap(([, data, connectionId]) => {
        const { calculation, uniqueSelectedProducts, columns } = data;
        const customColumn = columns.find((column) => column.isCustom);
        const products = uniqueSelectedProducts.map((product, index) => ({
          detailsProductId: product.detailsProductId,
          order: index + 1,
        }));
        const term = (calculation.basePaymentTerms || []).find((term) => term.isSelected)?.term;

        const column: userFeature = {
          name: customColumn.name,
          isVisible: true,
          isSelected: true,
          isCustom: true,
          selectedTerm: term,
          products: products,
        };

        const payload: userFeatureRequest = {
          columns: [column],
          clientConnectionId: connectionId,
          UserAction: UserAction.userUpdated,
        };

        return of(userActions.updateuser({ data: payload }));
      })
    )
  );

  columnTotaluser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.changeColumnTotal),
      map((action) => action.data),
      withLatestFrom(this.userFacade.connectionId$),
      map(([data, connectionId]) => {
        const { columnTotalType, isAnyColumnSelected } = data;
        const payload: userFeatureRequest = {
          columnTotalType: columnTotalType,
          isAnyColumnSelected: isAnyColumnSelected,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleInterestRate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleInterestRate),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          showInterestRate: user.showInterestRate,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleCashDownAmount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleCashDownAmount),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          showAdditionalCashDown: user.showAdditionalCashDown,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleProductCost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleProductCost),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          showProductCostAmount: user.showProductCostAmount,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  toggleMonthlyCost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.toggleMonthlyCost),
      withLatestFrom(this.userFacade.vm$),
      map(([, user]) => {
        const payload: userFeatureRequest = {
          clientConnectionId: user.connectionId,
          UserAction: UserAction.user,
          showProductPaymentAmount: user.showProductPaymentAmount,
        };

        return userActions.updateuser({ data: payload });
      })
    )
  );

  copyProductToAllColumns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.copyProductToAllColumns),
      map((action) => action.data),
      withLatestFrom(this.userFacade.vm$, this.userFacade.connectionId$),
      map(([data, userRequest, connectionId]) => {
        const { columns } = userRequest;
        const modifiedColumns = columns.map((res)=>{
          const hasProduct = res.products.find((product)=> product.detailsProductId === data.detailsProductId);
          if(!hasProduct) res.products.push(data);
          return res;
        });

        const payload: userFeatureRequest = {
          columns: modifiedColumns,
          clientConnectionId: connectionId,
          UserAction: UserAction.user,
        };
        return userActions.updateuser({ data: payload });
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private loaderService: LoaderService,
    private appFacade: AppFacade,
    private userFacade: UserFacade,
    private userFacade: userFacade,
    private snackbarService: SnackbarService,
    private userService: userService,
    private translateService: TranslateService,
    private router: Router,
    private eventService: EventService
  ) {}
}
