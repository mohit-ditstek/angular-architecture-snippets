import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Address, Customer, CustomerPersonalDetails, CustomerTab, CustomerType } from '@app/entities';
import { CustomerInfoData } from '@app/store/deal';
import { CustomerDetails, CustomerDetailsRequest } from '../../models';
import * as CustomerActions from '../actions';
import { CustomerFacade } from './customer.facade';
describe('Customer Facade', () => {
  let facade: CustomerFacade;
  let store: Store;
  let dispatchSpy;
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
    idExpiration: '05-04-2022',
    dob: '02-12-2022',
    relationship: 'test',
    businessName: 'Soft',
  };
  const customerRequest: CustomerDetailsRequest = {
    id: 0,
    importId: '6475647',
    importSource: 'Lightspeed',
    numOrder: 0,
  };
  const customer: Customer[] = [
    {
      customerId: 1,
      personalInfo: basicDetails,
      currentAddress: null,
      mailingAddress: null,
      insuranceInfo: null,
      isMailingSame: false,
    },
    {
      customerId: 2,
      personalInfo: basicDetails,
      currentAddress: null,
      mailingAddress: null,
      insuranceInfo: null,
      isMailingSame: true,
    },
  ];
  const customerDetail: CustomerDetails = {
    customerType: CustomerType.Business,
    customers: customer,
    isValidationDisabled: false,
  };
  describe('Customer Facade', () => {
    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forRoot({})],
        providers: [CustomerFacade],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] });
      store = TestBed.inject(Store);
      facade = TestBed.inject(CustomerFacade);
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
      expect(store).toBeTruthy();
    });

    it('should handle getCustomerDetails action true value', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getCustomerDetails(customerRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.getCustomerDetails({ data: customerRequest }));
    });
    it('should handle getDMSCustomerDetails action true value', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getDMSCustomerDetails(customerRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.getDMSCustomerDetails({ data: customerRequest }));
    });
    it('should handle saveCustomer action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.saveCustomer();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.saveCustomers());
    });

    it('should handle changeCustomerType action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.changeCustomerType(CustomerType.Business);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.changeCustomerType({ data: CustomerType.Business }));
    });

    it('should handle customerDetailsUpdated action with isSecondaryCustomer true value', async () => {
      const isSecondaryCustomer = true;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.customerDetailsUpdated(customerDetail, isSecondaryCustomer);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.secondaryDetailsUpdated({ data: customerDetail }));
    });
    it('should handle customerDetailsUpdated action with isSecondaryCustomer false value', async () => {
      const isSecondaryCustomer = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.customerDetailsUpdated(customerDetail, isSecondaryCustomer);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.primaryDetailsUpdated({ data: customerDetail }));
    });

    it('should handle customerAddressUpdated action', async () => {
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
      const isMailingAddress = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.customerDetailsUpdated(address, isMailingAddress);
      expect(dispatchSpy).toBeCalledTimes(1);
    });

    it('should handle clearForm action', async () => {
      const isSecondaryCustomer = false;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.clearForm(isSecondaryCustomer);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.clearForm({ data: isSecondaryCustomer }));
    });

    it('should handle swapForm action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.swapForm();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.swapForm());
    });

    it('should handle copyForm action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.copyForm();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.copyForm());
    });

    it('should handle copyCurrentAddress action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.copyCurrentAddress();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.copyCurrentAddress());
    });
    it('should handle copyInsuranceInfo action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.copyInsuranceInfo();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.copyInsuranceInfo());
    });

    it('should handle customerTab action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.customerTab(CustomerTab.AddressInformation);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.customerTab({ data: CustomerTab.AddressInformation }));
    });

    it('should handle changeRelationship action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.changeRelationship('child');
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.changeRelationship({ data: 'child' }));
    });
    it('should handle getCustomersSuccess action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getCustomersSuccess(CustomerInfoData);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(CustomerActions.getCustomersSuccess({ data: CustomerInfoData }));
    });
  });
});
