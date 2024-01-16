import { Customer, CustomerEnum, CustomerTab, CustomerType, StartNumOrder, StateFeatureKey, WorksheetTab } from '@app/entities';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import { DealOverviewData } from '../../testing';
import { CommonState, CustomerState, UnitsState, WorksheetState } from '../reducers';
import * as CommonSelectors from './common.selectors';
import { DealLender } from '../../models';

const commonState: CommonState = {
  currentTab: DealTabPath.Customer,
  dealOverview: DealOverviewData, 
  loaded: false,
  isDealTypeChanged: false,
};
const unitState: UnitsState = {
  currentChanges: {
    units: {
      items: [],
      activeTab: -1,
      isDirty: false,
      isValid: false,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
      unitsReordered: false
    },
    options: [],
  },
  previousChanges: {
    units: {
      items: [],
      activeTab: -1,
      isDirty: false,
      isValid: false,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
      unitsReordered: false
    },
    options: [],
  },
  loaded: false,
  openRatingDialog: false,
  unitLoaded: false
};
const customerState: CustomerState = {
  currentChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    isDirty: false,
    isValid: true,
  },
  previousChanges: {
    customerType: CustomerType.Individual,
    primaryCustomer: new Customer(CustomerEnum.Primary),
    secondaryCustomer: new Customer(CustomerEnum.Secondary),
    isDirty: false,
    isValid: true,
  },
  loaded: false,
  currentTab: CustomerTab.PersonalInformation,
};
const worksheetState: WorksheetState = {
  loaded: false,
  currentTab: WorksheetTab.PurchaseUnit,
  present: false,
  ratingDialog: false,
  currentChanges: null,
  previousChanges: null,
  dealerCostToggle: false,
  activeUnitIndex: null,
  saveOnClose: false,
  activeUnitProductId: 0
  
};
const initialState = {
  getState: StateFeatureKey.Deal,
  common: commonState,
  units: unitState,
  customer: customerState,
  worksheet: worksheetState,
  saveOnClose: false
};

const landerData = {
  loaded: false,
  lenders: [],
  lenderDetails: new DealLender(),
};

const dealLayoutData = {
  loaded :  false,
  currentTab : DealTabPath.Customer ,
  dealOverview : DealOverviewData,
  lenderState : landerData,
  currentTabLock: true,
  isPartAccessoriesLocked : true,
  dmsImported: true,
  watermark: null,
};
describe('Dealer Common Selectors', () => {
  
  it('should handle dealOverview', () => {
    const result = CommonSelectors.dealOverview.projector(initialState.common);
    expect(result).toBe(DealOverviewData);
  });

  it('should handle currentTab', () => {
    const result = CommonSelectors.currentTab.projector(initialState.common);
    expect(result).toBe('customers');
  });
  it('should handle dealDetails', () => {
    const result = CommonSelectors.dealDetails.projector(DealOverviewData);
    const { creditApplicationId, id, customerName } = result;
    expect(result).toStrictEqual({ creditApplicationId, id, customerName });
  });

  it('should handle isWorksheetLocked', () => {
    const result = CommonSelectors.isWorksheetLocked.projector(DealOverviewData);
    expect(result).toBe(false);
  });

  it('should handle isContractGenerated', () => {
    const result = CommonSelectors.isContractGenerated.projector(DealOverviewData);
    expect(result).toBe(false);
  });
  describe('currentTabLock', () => {
    it('should handle isCustomerLocked', () => {
      commonState.currentTab = DealTabPath.Customer;
      const dealOverview = commonState.dealOverview;
      CommonSelectors.currentTabLock.projector(commonState.currentTab, dealOverview);
      expect(dealOverview.isCustomerLocked).toBe(false);
    });

    it('should handle isUnitsLocked', () => {
      commonState.currentTab = DealTabPath.Units;
      const dealOverview = commonState.dealOverview;
      CommonSelectors.currentTabLock.projector(commonState.currentTab, dealOverview);
      expect(dealOverview.isUnitLocked).toBe(false);
    });
    it('should handle isLenderLocked', () => {
      commonState.currentTab = DealTabPath.Lenders;
      const dealOverview = commonState.dealOverview;
      CommonSelectors.currentTabLock.projector(commonState.currentTab, dealOverview);
      expect(dealOverview.isLenderLocked).toBe(false);
    });
    it('should handle isWorksheetLocked', () => {
      commonState.currentTab = DealTabPath.Worksheet;
      const dealOverview = commonState.dealOverview;
      CommonSelectors.currentTabLock.projector(commonState.currentTab, dealOverview);
      expect(dealOverview.isWorksheetLocked).toBe(false);
    });

    it('should handle currentTab', () => {
      commonState.currentTab = null;
      const dealOverview = commonState.dealOverview;
      CommonSelectors.currentTabLock.projector(commonState.currentTab, dealOverview);
      expect(dealOverview).toBe(dealOverview);
    });
  });

  it('should handle currentTab', () => {
    const result = CommonSelectors.dealLayoutViewModel.projector(dealLayoutData.loaded,dealLayoutData.currentTab,dealLayoutData.dealOverview,dealLayoutData.lenderState,dealLayoutData.currentTabLock,dealLayoutData.isPartAccessoriesLocked,dealLayoutData.dmsImported);
    expect(result).toBeTruthy();
  });
});
