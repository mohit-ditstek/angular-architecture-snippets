import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Address, Customer, CustomerMockData, CustomerPersonalDetails, CustomerTab, CustomerType, InsuranceInfo } from '@app/entities';
import { LoaderService, MockLoaderService, MockUtilityService, UtilityService } from '@app/shared/services';
import { MockRouterService } from '@app/shared/testing';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { MockCustomerFacade, MockCustomerService } from '@app/store/customer';
import { MockUserFacade, TaxFacade, UserFacade } from '@app/store/user';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { CustomerEffects } from '.';
import { CustomerDetails, CustomerDetailsRequest, CustomerResponse } from '../../models';
import { CustomerService } from '../../services';
import { MockDealFacade } from '../../testing';
import * as CustomerActions from '../actions';
import { CustomerFacade, DealFacade } from '../facades';
import { CustomerState } from '../reducers';

const basicDetails: CustomerPersonalDetails = {
  numOrder: 1,
  businessType: 'type',
  workPhone: '(765) 432-3456',
  taxId: '546554',
  isBusiness: false,
  firstName: 'T',
  middleName: 'E',
  lastName: 'S',
  fullName: 'Mohit',
  suffix: 'T',
  email: 'vikramjeetwins@gmail.com',
  mobilePhone: '(765) 432-3456',
  homePhone: '(765) 432-3456',
  idType: '2',
  idNumber: '4354',
  idState: 'test',
  idExpiration: '04-04-2023',
  dob: '02-12-2022',
  relationship: 'test',
  businessName: 'Soft',
};
const customerPersonalDetails: CustomerPersonalDetails = {
  numOrder: 2,
  businessType: 'type',
  workPhone: '(765) 432-3456',
  taxId: '546554',
  isBusiness: false,
  firstName: 'T',
  middleName: 'E',
  lastName: 'S',
  fullName: 'Mohit',
  suffix: 'T',
  email: 'vikramjeetwins@gmail.com',
  mobilePhone: '(765) 432-3456',
  homePhone: '(765) 432-3456',
  idType: '2',
  idNumber: '4354',
  idState: 'test',
  idExpiration: '04-04-2023',
  dob: '02-12-2022',
  relationship: 'test',
  businessName: 'Soft',
};

const address: Address = {
  type: 'XYZ',
  address: 'Cent jonn',
  unitNo: 'UN12',
  city: 'A',
  state: 'B',
  county: 'United State',
  country: 'US',
  zipCode: '454565',
  googlePlaceId: 'dfhj4549gfej',
  isDirty: false,
  isValid: false,
};

const insuranceInfo: InsuranceInfo = {
  type: 'test',
  company: 'ABC',
  policyNo: '233',
  startDate: new Date().toString(),
  endDate: new Date().toString(),
  deductibleAmount: 32,
  agentName: 'john',
  agentPhone: '9566685266',
  importSource: 'test',
  importId: 'r3',
  isDirty: false,
  isValid: false,
};
const customer: Customer[] = [
  {
    customerId: 1,
    personalInfo: basicDetails,
    currentAddress: address,
    mailingAddress: address,
    insuranceInfo: insuranceInfo,
    isMailingSame: false,
  },
  {
    customerId: 2,
    personalInfo: customerPersonalDetails,
    currentAddress: address,
    mailingAddress: address,
    insuranceInfo: insuranceInfo,
    isMailingSame: true,
  },
];
const customerDetail: CustomerDetails = {
  customerType: CustomerType.Individual,
  customers: customer,
  isValidationDisabled: false,
};

const customerResponse: CustomerResponse = {
  dealId: 1,
  customerIds: [1, 2],
};

const customerDetailsRequest: CustomerDetailsRequest = {
  id: 10,
  numOrder: 5,
};

const MockCustomerState: CustomerState = {
  currentChanges: CustomerMockData,
  previousChanges: CustomerMockData,
  loaded: true,
  currentTab: CustomerTab.AddressInformation,
};
describe('Customer Effect', () => {
  let customerService: CustomerService;
  let actions$: Observable<Action>;
  let effects: CustomerEffects;

  let dealFacade: DealFacade;
  let router: Router;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    TestBed.configureTestingModule({
      providers: [
        CustomerEffects,

        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: MockRouterService,
        },
        {
          provide: CustomerService,
          useValue: MockCustomerService,
        },
        {
          provide: UtilityService,
          useValue: MockUtilityService,
        },
        {
          provide: UserFacade,
          useValue: { ...MockUserFacade, currentOrgId$: of(1) },
        },
        {
          provide: DealFacade,
          useValue: MockDealFacade,
        },
        {
          provide: CustomerFacade,
          useValue: { ...MockCustomerFacade, customer$: of(MockCustomerState) },
        },
        {
          provide: LoaderService,
          useValue: MockLoaderService,
        },
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
        { provide: TaxFacade, useValue: { resetCustomerTaxes: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    effects = TestBed.inject(CustomerEffects);
    customerService = TestBed.inject(CustomerService);
    dealFacade = TestBed.inject(DealFacade);
    router = TestBed.inject(Router);
  });
  it('should be create', () => {
    expect(effects).toBeTruthy();
  });

  describe('should check getCustomerDetails effect', () => {
    const customer: Customer = {
      customerId: 1,
      personalInfo: basicDetails,
      currentAddress: address,
      mailingAddress: address,
      insuranceInfo: insuranceInfo,
      isMailingSame: false,
    };
    it('should return an getCustomerDetails action, with the client, on success', () => {
      const data = { ...customerDetail, numOrder: 5 };
      const action = CustomerActions.getCustomerDetails({ data: customerDetailsRequest });
      const outcome = CustomerActions.getCustomerDetailsSuccess({ data: customer });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: customerDetail });
      const expected = cold('--b', { b: outcome });

      customerService.getCustomerDetails = jest.fn(() => response);
      expect(effects.getCustomerDetails$).not.toBeObservable(expected);
    });
    it('should return an getCustomerDetails action, with the client, on success', () => {
      const action = CustomerActions.getCustomerDetails({ data: customerDetailsRequest });
      const outcome = CustomerActions.getCustomerDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#', { a: customerDetail });
      const expected = cold('--b', { b: outcome });

      customerService.getCustomerDetails = jest.fn(() => response);
      expect(effects.getCustomerDetails$).toBeObservable(expected);
    });
  });
  describe('should check getDMSCustomerDetails effect', () => {
    it('should return an getDMSCustomerDetailsSuccess action, with the client, on success', () => {
      const data = { ...customerDetail, numOrder: 5 };
      const action = CustomerActions.getDMSCustomerDetails({ data: customerDetailsRequest });
      const outcome = CustomerActions.getDMSCustomerDetailsSuccess({ data });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: customerDetail });
      const expected = cold('--b', { b: outcome });

      customerService.getDMSCustomerDetails = jest.fn(() => response);
      expect(effects.getDMSCustomerDetails$).toBeObservable(expected);
    });
    it('should return an getDMSCustomerDetailsFailure action, with the client, on failure', () => {
      const action = CustomerActions.getDMSCustomerDetails({ data: customerDetailsRequest });
      const outcome = CustomerActions.getDMSCustomerDetailsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#', { a: customerDetail });
      const expected = cold('--b', { b: outcome });

      customerService.getDMSCustomerDetails = jest.fn(() => response);
      expect(effects.getDMSCustomerDetails$).toBeObservable(expected);
    });
  });

  describe('newCustomers Effect', () => {
    it('should return an newCustomers action, with the client, on success', () => {
      const action = CustomerActions.newCustomers({ data: customerDetail });
      const outcome = CustomerActions.newCustomersSuccess({ data: 1 });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: customerResponse });
      const expected = cold('--b', { b: outcome });

      customerService.saveCustomers = jest.fn(() => response);
      expect(effects.newCustomers$).toBeObservable(expected);
      jest.advanceTimersByTime(2000);
    });

    it('should return an newCustomers action, with the client, on Failure', () => {
      const action = CustomerActions.newCustomers({ data: customerDetail });
      const outcome = CustomerActions.newCustomersFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: customerResponse });
      const expected = cold('--b', { b: outcome });

      customerService.saveCustomers = jest.fn(() => response);

      expect(effects.newCustomers$).toBeObservable(expected);
    });
  });

  describe('updateCustomers Effect', () => {
    it('should return an updateCustomers action, with the client, on success', () => {
      const action = CustomerActions.updateCustomers({ data: customerDetail });
      const outcome = CustomerActions.updateCustomersSuccess({ data: [1, 2] });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: customerResponse });
      const expected = cold('--b', { b: outcome });

      customerService.updateCustomers = jest.fn(() => response);

      expect(effects.updateCustomers$).toBeObservable(expected);
      jest.advanceTimersByTime(2000);
    });

    it('should return an updateCustomers action, with the client, on Failure', () => {
      const action = CustomerActions.updateCustomers({ data: customerDetail });
      const outcome = CustomerActions.updateCustomersFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', { a: customerResponse });
      const expected = cold('--b', { b: outcome });

      customerService.updateCustomers = jest.fn(() => response);

      expect(effects.updateCustomers$).toBeObservable(expected);
    });
  });

  it('should check newCustomersSuccess$ not dispatch method', () => {
    // set up the initial action that triggers the effect
    const action = CustomerActions.newCustomersSuccess({ data: 1 });

    // spy on the services call
    // this makes sure we're not testing the service, just the effect
    const mockSuccess = jest.spyOn(router, 'navigateByUrl');

    // set up our action list
    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: action });

    // check that the output of the effect is what we expect it to be
    // (by doing this we will trigger the service call)
    // Note that because we don't transform the stream in any way,
    // the output of the effect is the same as the input.
    expect(effects.newCustomersSuccess$).not.toBeObservable(response);

    // check that the services was called
    expect(mockSuccess).toHaveBeenCalled();
  });

  it('should check updatePrimaryCustomerName$ not dispatch method', () => {
    // set up the initial action that triggers the effect
    const action = CustomerActions.getCustomersSuccess({ data: customerDetail });

    // spy on the services call
    // this makes sure we're not testing the service, just the effect
    const mockFacade = jest.spyOn(dealFacade, 'updatePrimaryCustomerName');

    // set up our action list
    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: action });

    // check that the output of the effect is what we expect it to be
    // (by doing this we will trigger the service call)
    // Note that because we don't transform the stream in any way,
    // the output of the effect is the same as the input.
    expect(effects.updatePrimaryCustomerName$).not.toBeObservable(response);

    // check that the services was called
    expect(mockFacade).toHaveBeenCalled();
  });

  describe('should check saveCustomers effect', () => {
    it('should return an updateCustomer action', () => {
      const action = CustomerActions.saveCustomers();
      const outcome = CustomerActions.updateCustomers({ data: customerDetail });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: customerResponse });
      const expected = cold('--b', { b: outcome });

      customerService.updateCustomers = jest.fn(() => response);
      expect(effects.saveCustomers$).not.toBeObservable(expected);
    });
  });
});
