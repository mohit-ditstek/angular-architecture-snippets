import { Action, createReducer, on } from '@ngrx/store';
import { Customer, CustomerData, CustomerEnum, CustomerTab, CustomerType, FormStatus } from '@app/entities';
import { validAddressData } from '../../helpers';
import * as CustomerActions from '../actions';

export interface CustomerState {
  currentChanges: CustomerData;
  previousChanges: CustomerData;
  loaded: boolean;
  currentTab: CustomerTab;
}
const formStatusFields = new FormStatus();

export const initialCustomerState: CustomerState = {
  currentChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    ...formStatusFields,
  },
  previousChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    ...formStatusFields,
  },
  loaded: false,
  currentTab: CustomerTab.PersonalInformation,
};

const customerWithFormStatusFields = (primaryCustomer?: Customer, secondaryCustomer?: Customer) => {
  const hasDetails = !!(primaryCustomer || secondaryCustomer);
  const statusFields = new FormStatus(hasDetails);

  if (primaryCustomer) {
    primaryCustomer = {
      ...primaryCustomer,
    };
  } else {
    primaryCustomer = new Customer(CustomerEnum.Primary);
  }

  if (secondaryCustomer) {
    secondaryCustomer = {
      ...secondaryCustomer,
      ...formStatusFields,
    };
  } else {
    secondaryCustomer = new Customer(CustomerEnum.Secondary);
  }

  // Address Tab
  const validPrimaryAddress = validAddressData(primaryCustomer.currentAddress, primaryCustomer.mailingAddress);
  const validSecondaryAddress = validAddressData(secondaryCustomer.currentAddress, secondaryCustomer.mailingAddress);
  const validAddressTab = validPrimaryAddress && validSecondaryAddress;

  return { primaryCustomer, secondaryCustomer, validAddressTab, ...statusFields };
};

const reducer = createReducer(
  initialCustomerState,
  on(CustomerActions.changeCustomerType, (state, payload) => {
    const { currentChanges } = state;
    const { customerType, primaryCustomer, secondaryCustomer } = currentChanges;
    const { customerId } = primaryCustomer;
    // When switches to Individual
    const isPreviouslyIndividualType = customerType == CustomerType.Individual;
    // When switches to Individual
    const isCurrentlyIndividualType = payload.data == CustomerType.Individual;

    const isPreviouslyBusiness = customerType == CustomerType.Business;
    const isCurrentlyBusiness = payload.data == CustomerType.Business;

    const isPreviouslyJoint = customerType == CustomerType.Joint;
    
    const changedJointToIndividualType = (isPreviouslyJoint && isCurrentlyIndividualType);

    const isDirty = !customerId || !changedJointToIndividualType;

    let updatePrimaryCustomer: Customer, updatedSecondaryCustomer: Customer;
    // When switches to Business
    if (isPreviouslyBusiness || isCurrentlyBusiness) {
      updatePrimaryCustomer = new Customer(CustomerEnum.Primary, primaryCustomer.customerId);
    } else {
      updatePrimaryCustomer = {
        ...primaryCustomer,
        customerId: primaryCustomer.customerId ?? null,
        personalInfo: {
          ...primaryCustomer.personalInfo,
          relationship: null,
        },
      };
    }

    // Is Business flag update
    updatePrimaryCustomer.personalInfo.isBusiness = isCurrentlyBusiness;

    // When switches to or from Individual
    if (isPreviouslyIndividualType || isCurrentlyIndividualType) {
      updatedSecondaryCustomer = new Customer(CustomerEnum.Secondary, secondaryCustomer.customerId);
    } else {
      updatedSecondaryCustomer = {
        ...secondaryCustomer,
        personalInfo: {
          ...secondaryCustomer.personalInfo,
          relationship: null,
        },
      };
    }
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        customerType: payload.data,
        primaryCustomer: updatePrimaryCustomer,
        secondaryCustomer: updatedSecondaryCustomer,
        isDirty: isDirty,
        isValid: changedJointToIndividualType,
      },
    };
  }),
  on(CustomerActions.getCustomersSuccess, (state, payload) => {
    const { customerType, customers } = payload.data;

    const currentPrimaryCustomer = customers.find((c) => c.personalInfo?.numOrder == CustomerEnum.Primary);
    const currentSecondaryCustomer = customers.find((c) => c.personalInfo?.numOrder == CustomerEnum.Secondary);
    const changes = customerWithFormStatusFields(currentPrimaryCustomer, currentSecondaryCustomer);

    return {
      ...state,
      currentChanges: { ...changes, customerType },
      previousChanges: { ...changes, customerType },
      loaded: true,
    };
  }),

  on(CustomerActions.getCustomerDetailsSuccess, (state, payload) => {
    const { currentChanges } = state;
    const { personalInfo, insuranceInfo, currentAddress, mailingAddress, numOrder } = payload.data;

    if (numOrder == 1) {
      return {
        ...state,
        currentChanges: {
          ...currentChanges,
          primaryCustomer: {
            ...currentChanges.primaryCustomer,
            personalInfo: {
              ...personalInfo,
              numOrder: payload.data.numOrder,
            },
            insuranceInfo: {
              ...insuranceInfo,
            },
            currentAddress: {
              ...currentAddress,
            },
            mailingAddress: {
              ...mailingAddress,
            },
          },
        },
        loaded: true,
      };
    }
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...currentChanges.secondaryCustomer,
          personalInfo: {
            ...personalInfo,
            numOrder: payload.data.numOrder,
          },
          insuranceInfo: {
            ...insuranceInfo,
          },
          currentAddress: {
            ...currentAddress,
          },
          mailingAddress: {
            ...mailingAddress,
          },
        },
      },
      loaded: true,
    };
  }),
  on(CustomerActions.getDMSCustomerDetailsSuccess, (state, payload) => {
    const { currentChanges } = state;
    const { personalInfo, insuranceInfo, currentAddress, mailingAddress, numOrder } = payload.data;

    if (numOrder == 1) {
      return {
        ...state,
        currentChanges: {
          ...currentChanges,
          primaryCustomer: {
            ...currentChanges.primaryCustomer,
            personalInfo: {
              ...personalInfo,
              numOrder: payload.data.numOrder,
            },
            insuranceInfo: {
              ...insuranceInfo,
            },
            currentAddress: {
              ...currentAddress,
            },
            mailingAddress: {
              ...mailingAddress,
            },
          },
        },
        loaded: true,
      };
    }
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...currentChanges.secondaryCustomer,
          personalInfo: {
            ...personalInfo,
            numOrder: payload.data.numOrder,
          },
          insuranceInfo: {
            ...insuranceInfo,
          },
          currentAddress: {
            ...currentAddress,
          },
          mailingAddress: {
            ...mailingAddress,
          },
        },
      },
      loaded: true,
    };
  }),

  on(CustomerActions.updateCustomersSuccess, (state, { data }) => {
    const [primaryCustomerId, secondaryCustomerId] = data;

    const { currentChanges } = state;
    const { primaryCustomer, secondaryCustomer } = currentChanges;
    const updatedCustomers = customerWithFormStatusFields(primaryCustomer, secondaryCustomer);
    const updatedChanges = {
      ...currentChanges,
      primaryCustomer: {
        ...updatedCustomers.primaryCustomer,
        customerId: primaryCustomerId || null,
      },
      secondaryCustomer: {
        ...updatedCustomers.secondaryCustomer,
        customerId: secondaryCustomerId || null,
      },
      validAddressTab: true,
    };

    return {
      ...state,
      currentChanges: {
        ...updatedChanges,
        isValid: true,
        isDirty: false,
      },
      previousChanges: {
        ...updatedChanges,
      },
    };
  }),
  on(CustomerActions.primaryDetailsUpdated, (state, { data }) => {
    const { currentChanges } = state;
    const { isValid, isDirty } = data as { isValid: boolean; isDirty: boolean };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        primaryCustomer: {
          ...currentChanges.primaryCustomer,
          ...data,
        },
        isValid,
        isDirty,
      },
    };
  }),
  on(CustomerActions.secondaryDetailsUpdated, (state, { data }) => {
    const { currentChanges } = state;

    const { isValid, isDirty } = data as { isValid: boolean; isDirty: boolean };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...currentChanges.secondaryCustomer,
          ...data,
        },
        isValid,
        isDirty,
      },
    };
  }),
  on(CustomerActions.clearForm, (state, payload) => {
    const { currentChanges } = state;
    const { customerType, primaryCustomer, secondaryCustomer } = currentChanges;
    if (payload.data) {
      return {
        ...state,
        currentChanges: {
          ...currentChanges,
          secondaryCustomer: new Customer(CustomerEnum.Secondary, secondaryCustomer.customerId),
        },
      };
    }

    const updatedPrimaryCustomer = new Customer(CustomerEnum.Primary, primaryCustomer.customerId);
    updatedPrimaryCustomer.personalInfo.isBusiness = customerType == CustomerType.Business;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        primaryCustomer: {
          ...updatedPrimaryCustomer,
        },
      },
    };
  }),
  on(CustomerActions.swapForm, (state) => {
    const { currentChanges } = state;
    const { primaryCustomer, secondaryCustomer } = currentChanges;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        primaryCustomer: {
          ...secondaryCustomer,
          customerId: primaryCustomer.customerId,
          personalInfo: {
            ...secondaryCustomer.personalInfo,
            numOrder: primaryCustomer.personalInfo.numOrder,
            relationship: null,
          },
          currentAddress: {
            ...secondaryCustomer.currentAddress,
          },
          mailingAddress: {
            ...secondaryCustomer.mailingAddress,
          },
          insuranceInfo: {
            ...secondaryCustomer.insuranceInfo,
          },
        },
        secondaryCustomer: {
          ...primaryCustomer,
          customerId: secondaryCustomer.customerId,
          personalInfo: {
            ...primaryCustomer.personalInfo,
            numOrder: secondaryCustomer.personalInfo.numOrder,
            relationship: secondaryCustomer.personalInfo.relationship,
          },
          currentAddress: {
            ...primaryCustomer.currentAddress,
          },
          mailingAddress: {
            ...primaryCustomer.mailingAddress,
          },
          insuranceInfo: {
            ...primaryCustomer.insuranceInfo,
          },
        },
        isDirty: true,
      },
    };
  }),
  on(CustomerActions.copyCurrentAddress, (state) => {
    const { currentChanges } = state;
    const { primaryCustomer, secondaryCustomer } = currentChanges;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...secondaryCustomer,
          isMailingSame: primaryCustomer.isMailingSame,
          currentAddress: {
            ...primaryCustomer.currentAddress,
          },
          mailingAddress: {
            ...primaryCustomer.mailingAddress,
          },
        },
      },
    };
  }),
  on(CustomerActions.copyInsuranceInfo, (state) => {
    const { currentChanges } = state;
    const { primaryCustomer, secondaryCustomer } = currentChanges;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...secondaryCustomer,
          insuranceInfo: {
            ...primaryCustomer.insuranceInfo,
          },
        },
      },
    };
  }),
  on(CustomerActions.copyForm, (state) => {
    const { currentChanges } = state;
    const { customerType, primaryCustomer, secondaryCustomer } = currentChanges;

    const isBusinessType = customerType == CustomerType.Business;

    const personalInfo = isBusinessType
      ? { ...secondaryCustomer.personalInfo }
      : { ...secondaryCustomer.personalInfo, homePhone: primaryCustomer.personalInfo.homePhone };

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...secondaryCustomer,
          personalInfo: {
            ...personalInfo,
          },
          currentAddress: {
            ...primaryCustomer.currentAddress,
          },
          mailingAddress: {
            ...primaryCustomer.mailingAddress,
          },
          insuranceInfo: {
            ...primaryCustomer.insuranceInfo,
          },
        },
      },
    };
  }),
  on(CustomerActions.resetEvent, () => {
    return Object.assign({}, initialCustomerState);
  }),
  on(CustomerActions.resetTabEvent, (state) => {
    return {
      ...state,
      currentChanges: { ...state.previousChanges, ...formStatusFields },
    };
  }),
  on(CustomerActions.customerTab, (state, { data }) => {
    const { validAddressTab } = state.currentChanges;
    const currentChanges = validAddressTab ? { ...state.previousChanges } : { ...state.currentChanges };
    return {
      ...state,
      currentTab: data,
      currentChanges: { ...currentChanges, ...formStatusFields },
    };
  }),
  on(CustomerActions.changeRelationship, (state, { data }) => {
    const { currentChanges } = state;
    const { secondaryCustomer, isValid } = currentChanges;
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        secondaryCustomer: {
          ...secondaryCustomer,
          personalInfo: {
            ...secondaryCustomer.personalInfo,
            relationship: data,
          },
        },
        isValid,
      },
    };
  })
);

export function customerReducer(state: CustomerState, action: Action) {
  return reducer(state, action);
}
