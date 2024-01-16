import { createAction, props } from '@ngrx/store';
import { ActionPayloadData, Customer, CustomerData, CustomerTab, CustomerType } from '@app/entities';
import { CustomerDetails } from '../../models/customer-details.model';
import { CustomerDetailsRequest } from '../../models';


export const getCustomersSuccess = createAction('[Customers] Get Customers Success', props<ActionPayloadData<CustomerDetails>>());

export const getCustomerDetails = createAction('[Customers] Get Customer Details', props<ActionPayloadData<CustomerDetailsRequest>>());
export const getCustomerDetailsSuccess = createAction('[Customers] Get Customer Details Success', props<ActionPayloadData<Customer>>());
export const getCustomerDetailsFailure = createAction('[Customers] Get Customer Details Failure');

export const changeCustomerType = createAction('[Customers] Change Customer Type', props<ActionPayloadData<CustomerType>>());

export const addCustomerDetailsSuccess = createAction('[Customers] Add Customer Details Success');

export const primaryDetailsUpdated = createAction('[Customers] Primary Details Updated', props<ActionPayloadData<object>>());
export const secondaryDetailsUpdated = createAction('[Customers] Secondary Details Updated', props<ActionPayloadData<object>>());

export const swapForm = createAction('[Customers] Swap Form');
export const clearForm = createAction('[Customers] Clear Form', props<ActionPayloadData<boolean>>());
export const copyForm = createAction('[Customers] Copy Form');
export const copyCurrentAddress = createAction('[Customers] Copy Current Address');
export const copyInsuranceInfo = createAction('[Customers] Copy Insurance info');

export const saveCustomers = createAction('[Customers] Save Customers');

export const updateCustomers = createAction('[Customers] Update Customers', props<ActionPayloadData<CustomerDetails>>());
export const updateCustomersSuccess = createAction('[Customers] Update Customers Success', props<ActionPayloadData<number[]>>());
export const updateCustomersFailure = createAction('[Customers] Update Customers Failure');

export const newCustomers = createAction('[Customers] New Customers', props<ActionPayloadData<CustomerDetails>>());
export const newCustomersSuccess = createAction('[Customers] New Customers Success', props<ActionPayloadData<number>>());
export const newCustomersFailure = createAction('[Customers] New Customers Failure');

export const customerTab = createAction('[Customers] Customer Tab', props<ActionPayloadData<CustomerTab>>());
export const customerChange = createAction('[Customers] Customer Changes', props<ActionPayloadData<CustomerData>>());

export const changeRelationship = createAction('[Customers] Change Relationship', props<ActionPayloadData<string>>());

export const getDMSCustomerDetails = createAction('[Customers] Get DMS Customer Details', props<ActionPayloadData<CustomerDetailsRequest>>());
export const getDMSCustomerDetailsSuccess = createAction('[Customers] Get DMS Customer Details Success', props<ActionPayloadData<any>>());
export const getDMSCustomerDetailsFailure = createAction('[Customers] Get DMS Customer Details Failure');

