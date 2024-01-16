import { Action, createReducer, on } from '@ngrx/store';
import { DealTabType } from '@app/entities';
import { DealTabPath } from '../../enum';
import { DealOverview } from '../../models';
import * as DealActions from '../actions';

export interface CommonState {
  loaded: boolean;
  dealOverview: DealOverview;
  isDealTypeChanged: boolean;

  currentTab: DealTabPath;
}

export const initialCommonState: CommonState = {
  loaded: false,
  currentTab: DealTabPath.Customer,
  dealOverview: new DealOverview(),
  isDealTypeChanged: false,
};

const reducer = createReducer(
  initialCommonState,
  on(DealActions.getDealSuccess, (state, { data }) => {
    return {
      ...state,
      dealOverview: {
        ...new DealOverview(data),
      },
      loaded: true,
    };
  }),
  on(DealActions.dealTab, (state, { data }) => ({
    ...state,
    currentTab: data,
  })),

  on(DealActions.primaryCustomerNameUpdate, (state, payload) => ({
    ...state,
    dealOverview: {
      ...state.dealOverview,
      customerName: payload.data,
    },
  })),

  on(DealActions.primaryUnitUpdate, (state, { data }) => ({
    ...state,
    dealOverview: {
      ...state.dealOverview,
      primaryUnit: data,
    },
  })),

  on(DealActions.updateLenderName, (state, { data }) => ({
    ...state,
    dealOverview: {
      ...state.dealOverview,
      lenderName: data.name,
      dealLenderId: data.dealLenderId,
    },
  })),

  on(DealActions.totalDealAmountUpdate, (state, { data }) => {
    const { dealType } = state.dealOverview;
    const isDealTypeChanged = dealType !== data.dealType;
    return {
      ...state,
      dealOverview: {
        ...state.dealOverview,
        ...data,
      },
      isDealTypeChanged,
    };
  }),

  on(DealActions.lastUpdateDateTimeUpdate, (state) => {
    const updateDateTimeUtc = new Date().toISOString();

    return {
      ...state,
      dealOverview: {
        ...state.dealOverview,
        lastUpdateDateTimeUtc: updateDateTimeUtc,
      },
    };
  }),

  on(DealActions.dealTab, (state, { data }) => ({
    ...state,
    currentTab: data,
  })),

  on(DealActions.updateContactsSuccess, (state, { data }) => ({
    ...state,
    dealOverview: {
      ...state.dealOverview,
      ...data,
    },
  })),

  on(DealActions.updateDealTabLocks, (state, { data }) => {
    const { dealOverview } = state;
    return {
      ...state,
      dealOverview: {
        ...dealOverview,
        ...data,
      },
    };
  }),

  on(DealActions.updateDealTabUnLocksSuccess, (state, { data }) => {
    const { dealOverview } = state;
    const { currentTab } = data;

    let { isCustomerLocked, isUnitLocked, isWorksheetLocked, isPartAccessoriesLocked, isContractsGenerated, isLenderLocked } = dealOverview;

    if (currentTab === DealTabType.Customer) {
      isCustomerLocked = false;
      isContractsGenerated = false;
      isLenderLocked = false;
    }
    if (currentTab === DealTabType.Lender) {
      isCustomerLocked = false;
      isContractsGenerated = false;
      isLenderLocked = false;
      isUnitLocked = false;
      isWorksheetLocked = false;
    }
    if (currentTab === DealTabType.Units || currentTab === DealTabType.DealWorksheet) {
      isUnitLocked = false;
      isWorksheetLocked = false;
      isCustomerLocked = false;
      isPartAccessoriesLocked = false;
      isContractsGenerated = false;
      isLenderLocked = false;
    }

    return {
      ...state,
      dealOverview: {
        ...dealOverview,
        isCustomerLocked,
        isUnitLocked,
        isWorksheetLocked,
        isPartAccessoriesLocked,
        isContractsGenerated,
        isLenderLocked,
      },
    };
  }),
  on(DealActions.resetEvent, () => {
    return Object.assign({}, initialCommonState);
  }),

  on(DealActions.resetDealType, (state) => {
    return {
      ...state,
      isDealTypeChanged: false,
    };
  }),
  on(DealActions.setDeliveryDate, (state, { data }) => {
    const { dealOverview } = state;
    return {
      ...state,
      dealOverview: { ...dealOverview, deliveryDate: data },
    };
  }),
  on(DealActions.setNotesCount, (state, { data }) => {
    return {
      ...state,
      dealOverview: {
        ...state.dealOverview,
        notesCount: data,
      },
    };
  }),
  on(DealActions.updateNotesCount, (state) => {
    const { notesCount } = state.dealOverview;

    return {
      ...state,
      dealOverview: {
        ...state.dealOverview,
        notesCount: notesCount + 1,
      },
    };
  }),

  on(DealActions.updateDocsCount, (state, { data }) => {
    return {
      ...state,
      dealOverview: {
        ...state.dealOverview,
        docsCount: data,
      },
    };
  })
);

export function commonReducer(state: CommonState | undefined, action: Action) {
  return reducer(state, action);
}
