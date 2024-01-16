import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DealType, FinanceTerm, PurchaseUnit, RatedProduct, WorksheetDetails, WorksheetDetailsRequest, WorksheetTab } from '@app/entities';
import { EventService, LoaderService } from '@app/shared/services';
import { applyCustomerTaxes, isTaxRatesNotAvailable, updateWorksheetDetailTaxes } from '@app/shared/utils';
import { AppFacade } from '@app/store/app';
import { TaxFacade, UserFacade } from '@app/store/user';
import { catchError, concatMap, finalize, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { DealTabPath } from '../../enum';
import { DealTabLocks } from '../../models';
import { WorksheetService } from '../../services';
import * as WorksheetActions from '../actions';
import { DealFacade } from '../facades';
import { WorksheetFacade } from '../facades/worksheet.facade';

@Injectable()
export class WorksheetEffects {
  getWorksheetDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorksheetActions.getWorksheetDetails, WorksheetActions.unlockEvent),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([openRatingDialog, orgId, dealId]) => {
        return this.worksheetService.getWorkSheetDetails(orgId, dealId).pipe(
          map((res) => {
            const currentTab = this.router.url.split('/').pop() as WorksheetTab;
            const isValid = currentTab == WorksheetTab.PurchaseUnit ? res.units.every((u) => u.sellingPrice) : true;
            return WorksheetActions.getWorksheetDetailsSuccess({ data: { ...res, isValid } });
          }),
          finalize(() => {
            // Open Dialog after resetting products then Get Worksheet changes again
            if (openRatingDialog) this.worksheetFacade.resetRatingProductsSuccess(openRatingDialog);
          }),
          catchError(() => of(WorksheetActions.getWorksheetDetailsFailure()))
        );
      })
    )
  );

  getWorksheetDetailsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.getWorksheetDetailsSuccess),
        map((action) => action.data),
        tap((worksheet) => {
          this.updateTotalAmount(worksheet);
          this.worksheetFacade.updateTabLocks();
        })
      ),
    { dispatch: false }
  );

  saveWorksheetDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorksheetActions.calculateWorksheetDetails),
      map((action) => action.data),
      withLatestFrom(
        this.userFacade.currentOrgId$,
        this.dealFacade.dealId$,
        this.worksheetFacade.workSheetDetails$,
        this.worksheetFacade.isDealTypeChanged$,
        this.worksheetFacade.activeUnitIndex$,
        this.appFacade.currentRouteState$
      ),
      switchMap(([save, orgId, dealId, worksheetDetails, isDealTypeChanged, activeUnitIndex, routeData]) => {
        const updatedWorksheetDetails = updateWorksheetDetailTaxes(worksheetDetails, activeUnitIndex);
        const {
          isValid,
          isDirty,
          units,
          tradeIns,
          products,
          totalNonInstalledPartsAccessoriesLabor,
          totalNonInstalledPartsAccessoriesLaborCalculated,
          overrideTotalNonInstalledPartsAccessoriesLabor,
          salesOtherTax,
          totalRebates,
          dealType,
          deliveryDate,
          terms,
          taxes,
          termFrequency,
          interestRate,
          daysToFirstPayment,
          includeSelectedProductsOnly,
          disableIncludeSelectedProductsOnly,
          isDealTypeModified,
          isSalesOtherTaxOverridden,
          taxJurisdiction,
          isAnyProductSelectionDisabled,
          isPresentationCompleted,
          isValidationDisabled,
          deposits,
          totalCashDown,
          isTotalCashDownOverridden,

          primaryCustomerName,
          presentedDateTimeUtc,
        } = updatedWorksheetDetails;
        const bindingKeys = [
          'id',
          'label',
          'sellingPrice',
          'totalSellingPrice',
          'discount',
          'freight',
          'isFreightTaxed',
          'dealerPrep',
          'isPrepHandlingTaxed',
          'products',
          'totalInstalledPartsAccessories',
          'totalInstalledPartsAccessoriesCalculated',
          'overrideTotalInstalledPartsAccessories',
          'overrideTotalLabor',
          'vehicleTax',
          'isVehicleTaxOverridden',
          'totalLabor',
          'totalRebates',
          'isRebatesExcludedFromTax',
          'totalLaborCalculated',
          'isFeesOverridden',
          'fees',
          'taxes',
          'deposits',
          'totalCashDown',
          'isTotalCashDownOverridden',
          'type',
          'subType',
          'taxProfiles',
          'isTaxProfileModified',
          'taxProfileId',
          'numOrder',
        ];
        // Getting unique terms with selected value
        const updatedTerms = terms ? terms.filter((t) => t.term) : [];
        updatedTerms.sort((x) => (x.isSelected ? -1 : 1));
        const uniqueTerms = updatedTerms.filter((term, index, arr) => arr.map((t) => t.term).indexOf(term.term) == index);
        const productMap = (products: RatedProduct[]) => {
          return products.map((p) => {
            let { totalTaxAmount, totalTaxRate } = p;
            if (p.isTaxAmountOverridden) totalTaxRate = null;
            else totalTaxAmount = null;
            return Object.assign({}, p, { totalTaxRate, totalTaxAmount });
          });
        };

        const filteredUnits = units.map((data) => {
          const unit = bindingKeys.reduce((obj, key) => ((obj[key] = data[key]), obj), {}) as PurchaseUnit;
          if (data.isFeesOverridden) {
            unit.totalFees = data.totalFees;
          }
          const products = productMap(unit.products);
          return { ...unit, products: products };
        });
        const payload: WorksheetDetailsRequest = {
          units: filteredUnits,
          tradeIns,
          products: productMap(products),
          totalNonInstalledPartsAccessoriesLabor,
          totalNonInstalledPartsAccessoriesLaborCalculated,
          overrideTotalNonInstalledPartsAccessoriesLabor,
          disableIncludeSelectedProductsOnly,
          isDealTypeModified,
          salesOtherTax,
          totalRebates,
          dealType,
          deliveryDate,
          terms: uniqueTerms,
          termFrequency,
          interestRate,
          daysToFirstPayment,
          includeSelectedProductsOnly,
          save,
          taxes,
          isSalesOtherTaxOverridden,
          taxJurisdiction,
          isAnyProductSelectionDisabled,
          isPresentationCompleted,
          isValidationDisabled,
          deposits,
          totalCashDown,
          isTotalCashDownOverridden,
          primaryCustomerName,
          presentedDateTimeUtc,
        };

        if (save) this.appFacade.dataSaving();
        const preventBackgroundEvent = !routeData.url.includes(DealTabPath.Worksheet) || !payload.save;
        return this.worksheetService.updateWorksheetDetails(orgId, dealId, payload, preventBackgroundEvent).pipe(
          map((res) => {
            return WorksheetActions.calculateWorksheetDetailsSuccess({ data: { ...res, isDirty: isDirty, save: save, isValid } });
          }),
          tap(({ data }) => {
            this.updateTotalAmount(data);
            this.dealFacade.setDeliveryDate(data.deliveryDate);
          }),
          catchError(() => of(WorksheetActions.calculateWorksheetDetailsFailure())),
          finalize(() => {
            if (save) {
              // Update tab lock
              let ratedProducts = [];
              const { units, products, isPresentationCompleted } = payload;
              units.forEach((unit) => (ratedProducts = ratedProducts.concat(unit.products)));
              const allProducts = [...ratedProducts, ...products];
              this.updateDealTabLocks(allProducts, isPresentationCompleted);

              // Handling of saving button
              this.appFacade.dataSaved(true);
              setTimeout(() => this.appFacade.dataSaved(false), 2000);

              // Reload form if deal Type changed
              if (isDealTypeChanged) {
                this.eventService.dealTypeChangedObservable.next();
              }
            }
          })
        );
      })
    )
  );

  resetRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorksheetActions.resetRatingProducts),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$),
      concatMap(([isRePresent, orgId, dealId]) => {
        this.loaderService.showSpinner();
        return this.worksheetService.resetRatingProducts(orgId, dealId, isRePresent).pipe(map(() => WorksheetActions.getWorksheetDetails({ data: isRePresent })));
      })
    )
  );

  updateTaxesDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorksheetActions.getWorksheetDetailsSuccess, WorksheetActions.calculateWorksheetDetailsSuccess),
      map((action) => action.data),
      withLatestFrom(this.taxFacade.taxes$),
      concatMap(([res, taxes]) => {
        let updateWorksheet = false;
        const { dealerTaxes, customerTaxes } = taxes;
        const dealer = dealerTaxes.rates;
        const customer = customerTaxes.rates;
        if (customer.salesTaxAuto.length > 0) {
          // Calculate customer taxes if taxes are not applied
          updateWorksheet =
            res.units.some(
              (u) =>
                (!u.isVehicleTaxOverridden && u.taxes.some((tax) => isTaxRatesNotAvailable(tax))) ||
                u.products.some((product) => !product.isTaxAmountOverridden && isTaxRatesNotAvailable(product.tax))
            ) ||
            (!res.isSalesOtherTaxOverridden && res.taxes.some((tax) => isTaxRatesNotAvailable(tax))) ||
            res.products.some((product) => !product.isTaxAmountOverridden && isTaxRatesNotAvailable(product.tax));
          // Save customer taxes
          if (updateWorksheet) {
            res = applyCustomerTaxes(res, customer, dealer, res.isCommonUseTaxes);
            return [WorksheetActions.updateTaxesSuccess({ data: { ...res } })];
          }
        }
        return of();
      })
    )
  );

  updateCustomerTaxes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.updateTaxesSuccess),
        tap(() => {
          this.worksheetFacade.calculateWorksheetDetails(true);
        })
      ),
    { dispatch: false }
  );

  updateWorksheetDetails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WorksheetActions.updatePurchaseUnitDetails,
          WorksheetActions.updateTradeInDetails,
          WorksheetActions.updateOtherPayments,
          WorksheetActions.updateFinanceTerms,
          WorksheetActions.updateTaxDetails,
          WorksheetActions.salesOtherTaxes,
          WorksheetActions.updateProtectionProducts
        ),
        tap(({ type, data }) => {
          const isUpdateFinanceTerms = type === WorksheetActions.updateFinanceTerms.type;

          if (isUpdateFinanceTerms) {
            const { isValid, termsChanged } = data as FinanceTerm;
            const invalid = !isValid || termsChanged;
            if (invalid) return;
          }
          this.worksheetFacade.calculateWorksheetDetails(false);
        })
      ),
    { dispatch: false }
  );

  toggle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.updateProtectionProducts),
        tap(() => {
          this.worksheetFacade.updateProductSelectionToggle();
        })
      ),
    { dispatch: false }
  );

  getActiveUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorksheetActions.getActiveUnit),
      tap(() => WorksheetActions.getActiveUnitSuccess({ data: null })),
      withLatestFrom(this.appFacade.currentRouteParams$, this.worksheetFacade.workSheetDetails$),
      map(([, routeParams, worksheetDetails]) => {
        const { unitId } = routeParams;
        const { units } = worksheetDetails;

        const activeUnitIndex = units.findIndex((unit) => unit.id == +unitId);
        return WorksheetActions.getActiveUnitSuccess({ data: activeUnitIndex });
      })
    )
  );

  updateTabLocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.updateTabLocks),
        withLatestFrom(this.worksheetFacade.workSheetDetails$),
        tap(([, data]) => {
          const { products, units, isPresentationCompleted } = data;
          let ratedProducts = [];
          units.forEach((unit) => (ratedProducts = ratedProducts.concat(unit.products)));
          const allProducts = [...ratedProducts, ...products];
          this.updateDealTabLocks(allProducts, isPresentationCompleted);
        })
      ),
    { dispatch: false }
  );

  updateDeliveryDate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.updateDeliveryDate),
        tap(() => {
          this.worksheetFacade.calculateWorksheetDetails(true);
        })
      ),
    { dispatch: false }
  );

  resetRatingProductsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorksheetActions.resetRatingProductsSuccess),
        map((action) => action.data),
        withLatestFrom(this.worksheetFacade.showRatingDialog$),
        tap(([rePresent, data]) => {
          if (rePresent) this.worksheetFacade.showRateProduct(data.present);
        })
      ),
    { dispatch: false }
  );

  private updateTotalAmount(details: WorksheetDetails) {
    const amount = details.dealType == DealType.Cash ? details.totalDealAmount : details.totalAmountFinanced;
    this.dealFacade.updateTotalDealAmount(amount, details.dealType);
  }

  // Handled Deal Tab Locks
  private updateDealTabLocks(allProducts: RatedProduct[], isPresentationCompleted: boolean) {
    const hasProductPresented = allProducts.some((p) => p.isSelected || isPresentationCompleted);
    const selectedProducts = allProducts.filter((p) => p.isSelected || !p.isManual);
    const lockData: DealTabLocks = {
      isUnitLocked: selectedProducts.length > 0,
      isWorksheetLocked: hasProductPresented,
      isPartAccessoriesLocked: hasProductPresented,
    };
    this.dealFacade.updateDealTabLocks(lockData);
  }

  constructor(
    private readonly actions$: Actions,
    private worksheetService: WorksheetService,
    private dealFacade: DealFacade,
    private worksheetFacade: WorksheetFacade,
    private loaderService: LoaderService,
    private router: Router,
    private userFacade: UserFacade,
    private taxFacade: TaxFacade,
    private appFacade: AppFacade,
    private eventService: EventService
  ) {}
}
