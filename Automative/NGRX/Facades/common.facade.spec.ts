import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AddressData, DMSPushDealRequest, DealTabType, DealType, Note, PaymentCalcRequest, QuickActionRequest, UpdateContactsRequest } from '@app/entities';
import { QuickActionStatus } from '../../enum';
import { DealTabPath } from '../../enum/deal-tab-path.enum';
import { DealLender, DealTabLocks, QuickActionUpdateRequest } from '../../models';
import { DealOverviewData } from '../../testing';
import * as DealActions from '../actions';
import { DealFacade } from '../facades';

describe('Deal Facade', () => {
  let facade: DealFacade;
  let store: Store;
  let dispatchSpy;

  const dealTabLocks: DealTabLocks = {
    isCustomerLocked: true,
    isUnitLocked: true,
    isWorksheetLocked: true,
  };
  const data: DealLender = {
    referenceId: '134',
    name: 'Jhon',
    decisionStatus: 30,
    amount: 40,
    term: 50,
    buyRate: 340,
    maxRate: 40,
    customerRate: 50,
    maxBackEndAmount: 50,
    eltCode: 'WTR',
    notes: 'Saling',
    lienHolder: undefined,
    lossPayee: undefined,
    isDirty: false,
    isValid: false,
  };
  const paymentCalcRequest: PaymentCalcRequest = {
    deliveryDate: new Date(),
    amountFinanced: 23,
    interestRate: 23,
    daysToFirstPayment: 23,
    term: 23,
    termFrequency: 23,
  };

  const cloneDealRequest: QuickActionRequest = {
    markOriginalDead: false,
    reason: 'anything',
    dealId: 11,
  };
  const quickActionUpdateRequest: QuickActionUpdateRequest = {
    state: QuickActionStatus.New,
    dealId: 0,
  };
  const blockUnbloackDealRequest: QuickActionRequest = {
    markOriginalDead: false,
    reason: 'anything',
    dealId: 11,
  };
  const dmsPushQuoteDealRequest: DMSPushDealRequest = {
    dealId: 11,
    providerCode: '',
    allowReExport: false,
  };
  describe('Customer Facade', () => {
    beforeEach(() => {
      @NgModule({
        imports: [StoreModule.forRoot({})],
        providers: [DealFacade],
      })
      class RootModule {}
      TestBed.configureTestingModule({
        imports: [RootModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      });
      store = TestBed.inject(Store);
      facade = TestBed.inject(DealFacade);
    });

    it('should be created', () => {
      expect(facade).toBeTruthy();
      expect(store).toBeTruthy();
    });
    it('should handle changeSalesPerson action', async () => {
      const updateSalesPersonRequest: UpdateContactsRequest = {
        salesPerson: 'Sale Person',
      };
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateContacts(updateSalesPersonRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateContacts({ data: updateSalesPersonRequest }));
    });
    it('should handle updateDocsCount action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateDocsCount(1);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateDocsCount({ data: 1 }));
    });
    it('should handle setNotesCount action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.setNotesCount(1);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.setNotesCount({ data: 1 }));
    });
    it('should handle updateNoteCount action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateNotesCount();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateNotesCount());
    });
    it('should handle updateDealOverviewDetails action', async () => {
      const dealData = DealOverviewData;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateDealOverviewDetails(dealData);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateDealOverviewDetails({ data: dealData }));
    });

    it('should handle updatePrimaryCustomerName action', async () => {
      const payload = 'Vikram';
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updatePrimaryCustomerName(payload);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.primaryCustomerNameUpdate({ data: payload }));
    });

    it('should handle updatePrimaryUnit action', async () => {
      const primaryUnit = 'XYZ';
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updatePrimaryUnit(primaryUnit);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.primaryUnitUpdate({ data: primaryUnit }));
    });

    it('should handle dealTab action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dealTab(DealTabPath.Customer);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.dealTab({ data: DealTabPath.Customer }));
    });
    it('should handle updateLenderName action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateLenderName(data);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateLenderName({ data: data }));
    });
    it('should handle resetTabEvent action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetTabEvent();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.resetTabEvent());
    });

    it('should handle init action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.init(1);
      expect(dispatchSpy).toBeCalledTimes(1);
    });

    it('should handle getDeal action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getDeal(1);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.getDeal({ data: 1 }));
    });

    it('should handle newDeal ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.newDeal();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.newDeal());
    });

    it('should handle updateTotalDealAmount ction', async () => {
      const payload = { totalAmount: 12, dealType: DealType.Cash };
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateTotalDealAmount(12, DealType.Cash);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.totalDealAmountUpdate({ data: payload }));
    });

    it('should handle updateDealTabUnLocks ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateDealTabUnLocks(DealTabType.Customer);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateDealTabUnLocks({ data: DealTabType.Customer }));
    });
    it('should handle getOrgDetail action', async () => {
      const id = 439;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dmsRefresh(id);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.dmsRefresh({ data: id }));
    });

    it('should handle dmsUpdate action', async () => {
      const id = 439;
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dmsUpdate(id);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.dmsUpdate({ data: id }));
    });

    it('should handle getWorksheetDetails ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.getWorksheetDetails();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.getWorksheetDetails({ data: false }));
    });
    it('should handle unlockEvent ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.unlockEvent();
      expect(dispatchSpy).toBeCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.unlockEvent({ data: false }));
    });

    it('should handle reset ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.reset();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.resetEvent());
    });
    it('should handle lastUpdateDateTimeUpdate action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.lastUpdateDateTimeUpdate();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.lastUpdateDateTimeUpdate());
    });

    it('should handle openPresentDialog action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.openPresentDialog(true);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.openPresentDialog({ data: true }));
    });

    it('should handle updateDealTabLocks ction', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateDealTabLocks(dealTabLocks);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.updateDealTabLocks({ data: dealTabLocks }));
    });

    it('should handle create clone deal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.createCloneDeal(cloneDealRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.createCloneDeal({ data: cloneDealRequest }));
    });
    it('should handle deleteDeal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.deleteDeal(cloneDealRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.deleteDeal({ data: cloneDealRequest }));
    });
    it('should handle markDeadDeal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.markDeadDeal(cloneDealRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.markDeadDeal({ data: cloneDealRequest }));
    });
    it('should handle closeDeal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.closeDeal(quickActionUpdateRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.closeDeal({ data: quickActionUpdateRequest }));
    });
    it('should handle block unblock deal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.blockUnblockDeal(blockUnbloackDealRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.blockUnblockDeal({ data: blockUnbloackDealRequest }));
    });
    it('should handle block dmsPushDeal deal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.dmsPushDeal(dmsPushQuoteDealRequest);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.dmsPushDeal({ data: dmsPushQuoteDealRequest }));
    });
    it('should handle block unblock deal', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.resetDealType();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.resetDealType());
    });

    it('should handle set contract sale date', async () => {
      const date = new Date();
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.setDeliveryDate(date);
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.setDeliveryDate({ data: date }));
    });

    it('should handle updateNotes action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateNotes();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.getNotes({ data: new Note() }));
    });

    it('should handle updateDocs action', async () => {
      dispatchSpy = jest.spyOn(store, 'dispatch');
      facade.updateDocs();
      expect(dispatchSpy).toBeCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(DealActions.getDocs({ data: true }));
    });
  });
});
