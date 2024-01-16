import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Customer, CustomerTab, CustomerType } from '@app/entities';
import { EventService, LoaderService, UtilityService } from '@app/shared/services';
import { AppFacade } from '@app/store/app';
import { TaxFacade, UserFacade } from '@app/store/user';
import { catchError, concatMap, exhaustMap, finalize, map, of, tap, withLatestFrom } from 'rxjs';
import { computeFullName } from '../../helpers';
import { CustomerDetails } from '../../models';
import { CustomerService } from '../../services';
import * as CustomerActions from '../actions';
import { CustomerFacade, DealFacade } from '../facades';

@Injectable()
export class CustomerEffects {
  getCustomerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.getCustomerDetails),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        this.loaderService.showSpinner();
        return this.customerService.getCustomerDetails(orgId, payload.id).pipe(
          map((res) => {
            const data = { ...res, numOrder: payload.numOrder };
            return CustomerActions.getCustomerDetailsSuccess({ data });
          }),
          catchError(() => of(CustomerActions.getCustomerDetailsFailure()))
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );
  getDMSCustomerDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.getDMSCustomerDetails),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      concatMap(([payload, orgId]) => {
        this.loaderService.showSpinner();
        return this.customerService.getDMSCustomerDetails(payload.importSource, orgId, payload.importId).pipe(
          map((res) => {
            const data = { ...res, numOrder: payload.numOrder };
            return CustomerActions.getDMSCustomerDetailsSuccess({ data });
          }),
          catchError(() => of(CustomerActions.getDMSCustomerDetailsFailure()))
        );
      }),
      tap(() => {
        this.loaderService.hideSpinner();
      })
    )
  );

  saveCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.saveCustomers),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.customerFacade.customer$),
      concatMap(([, , dealId, customer]) => {
        const { currentChanges, currentTab } = customer;
        const { customerType, primaryCustomer, secondaryCustomer } = currentChanges;
        const isNotIndividualType = customerType != CustomerType.Individual;

        // Prevent api call
        const preventApiCall = isNotIndividualType && currentTab == CustomerTab.PersonalInformation && !secondaryCustomer.personalInfo.relationship;

        if (preventApiCall) return of();

        const customers = [];
        customers.push(mapToSaveRequest(primaryCustomer));
        if (isNotIndividualType) customers.push(mapToSaveRequest(secondaryCustomer));
        const payload: CustomerDetails = {
          customerType: Number(customerType),
          customers: customers,
          isValidationDisabled: false,
        };
        this.appFacade.dataSaving();
        if (dealId > 0) {
          this.eventService.resetMaskingObservable.next();
          return of(CustomerActions.updateCustomers({ data: payload }));
        }

        return of(CustomerActions.newCustomers({ data: payload }));
      })
    )
  );

  newCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.newCustomers),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$),
      exhaustMap(([payload, orgId]) => {
        this.appFacade.dataSaving();
        return this.customerService.saveCustomers(orgId, payload).pipe(
          map((res) => {
            return CustomerActions.newCustomersSuccess({ data: res.dealId });
          }),
          tap(() => this.appFacade.dataSaved(true)),
          catchError(() => of(CustomerActions.newCustomersFailure())),
          finalize(() => {
            setTimeout(() => {
              this.appFacade.dataSaved(false);
            }, 2000);
          })
        );
      })
    )
  );

  updateCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomers),
      map((action) => action.data),
      withLatestFrom(this.userFacade.currentOrgId$, this.dealFacade.dealId$, this.customerFacade.customer$),
      concatMap(([payload, orgId, dealId, customer]) => {
        this.appFacade.dataSaving();
        return this.customerService.updateCustomers(orgId, dealId, payload).pipe(
          map((res) => {
            return CustomerActions.updateCustomersSuccess({ data: res.customerIds });
          }),
          tap(() => {
            //  Compare customer address and If customer taxes change get customer taxes
            const { currentChanges, previousChanges } = customer;
            const currentAddress = currentChanges.primaryCustomer?.currentAddress;
            const previousAddress = previousChanges.primaryCustomer?.currentAddress;
            const isAddressChanged = this.utilityService.compareObject(currentAddress, previousAddress);
            if (isAddressChanged) {
              this.taxFacade.resetCustomerTaxes();
              this.taxFacade.getCustomerTaxRates(currentAddress);
            }
            this.appFacade.dataSaved(true);
          }),
          catchError(() => of(CustomerActions.updateCustomersFailure())),
          finalize(() => {
            setTimeout(() => {
              this.appFacade.dataSaved(false);
            }, 2000);
          })
        );
      })
    )
  );

  newCustomersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerActions.newCustomersSuccess),
        map((action) => action.data),
        tap((dealId) => {
          this.router.navigateByUrl(`/deals/${dealId}/units`);
        })
      ),
    { dispatch: false }
  );

  updatePrimaryCustomerName$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerActions.getCustomersSuccess, CustomerActions.swapForm, CustomerActions.changeCustomerType),
        withLatestFrom(this.customerFacade.customerType$, this.customerFacade.primaryCustomer$),
        tap(([, customerType, primaryCustomer]) => {
          const name = computeFullName(customerType, primaryCustomer.personalInfo, false);
          this.dealFacade.updatePrimaryCustomerName(name);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private router: Router,
    private loaderService: LoaderService,
    private dealFacade: DealFacade,
    private customerService: CustomerService,
    private customerFacade: CustomerFacade,
    private userFacade: UserFacade,
    private eventService: EventService,
    private appFacade: AppFacade,
    private utilityService: UtilityService,
    private taxFacade: TaxFacade,
  ) {}
}

const mapToSaveRequest = (customer: Customer) => {
  const { customerId, personalInfo, isMailingSame, currentAddress, mailingAddress, insuranceInfo } = customer;
  const { startDate, endDate } = insuranceInfo;

  const currentAddressCopy = Object.keys(currentAddress || {});
  const mailingAddressCopy = Object.keys(mailingAddress || {});

  const checkCurrentAddressFields =
    (currentAddressCopy.includes('address') && !!currentAddress.address) ||
    (currentAddressCopy.includes('state') && !!currentAddress.state) ||
    (currentAddressCopy.includes('city') && !!currentAddress.city) ||
    (currentAddressCopy.includes('zipCode') && !!currentAddress.zipCode);
  const checkMailingAddressFields =
    (mailingAddressCopy.includes('address') && !!mailingAddress.address) ||
    (mailingAddressCopy.includes('state') && !!mailingAddress.state) ||
    (mailingAddressCopy.includes('city') && !!mailingAddress.city) ||
    (mailingAddressCopy.includes('zipCode') && !!mailingAddress.zipCode);

  const customerPayload = {
    ...(personalInfo || {}),
    customerId: customerId || null,
    currentAddress: currentAddressCopy.length > 0 && checkCurrentAddressFields ? currentAddress : null,
    mailingAddress: mailingAddressCopy.length > 0 && checkMailingAddressFields ? mailingAddress : null,
    insuranceInfo: insuranceInfo
      ? {
          ...insuranceInfo,
          startDate: startDate || null,
          endDate: endDate || null,
        }
      : {},
    isMailingSame: isMailingSame,
  };
  return customerPayload;
};
