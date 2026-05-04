import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OtherPayments } from '@app/entities';
import { PipesModule } from '@app/shared/pipes';
import { EventService, MockDialogService, MockEventService, MockRxjsService, ModalService, RxjsService } from '@app/shared/services';
import { MockRouterService } from '@app/shared/testing';
import { OtherPaymentFormComponent } from './other-payment-form.component';
import { MockWorkSheetFacade, WorksheetData, WorksheetFacade } from '@app/store/deal';
import { of } from 'rxjs';

describe('OtherPaymentFormComponent', () => {
  let component: OtherPaymentFormComponent;
  let fixture: ComponentFixture<OtherPaymentFormComponent>;
  let modalService: ModalService;                                                                                                             
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherPaymentFormComponent ],
      imports: [
        TranslateModule.forRoot({}),
        FormsModule,
        PipesModule,
      ],
      providers: [
        {
          provide: ModalService,
          useValue: MockDialogService
        },
        {
          provide: WorksheetFacade,
          useValue: MockWorkSheetFacade
        },
        {
          provide : RxjsService,
          useValue: MockRxjsService
        },
        {
          provide : EventService,
          useValue: MockEventService
        },
        {
          provide : Router,
          useValue: MockRouterService
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPaymentFormComponent);
    component = fixture.componentInstance;
    component.details = WorksheetData as OtherPayments;
    fixture.detectChanges();
    modalService = TestBed.inject(ModalService);
    router = TestBed.inject(Router);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check formValuesChanged method', () => {
    const mockEventMethod = jest.spyOn(component.valuesChanged, 'emit');
    component.formValuesChanged();
    expect(mockEventMethod).toHaveBeenCalled();
  });

  describe('should check toggleAccessoryAmountField method', () => {
    it('should open confirmation dialog if toggle is true', () => {
      component.toggleAccessoryAmountField(true);
      expect(component.paymentForm.overrideTotalNonInstalledPartsAccessoriesLabor).toBe(true);
      expect(component.showAmountChangePopup).toBe(true);
    });
    it('should check with false value', () => {
      component.toggleAccessoryAmountField(false);
    });
  });

  describe('should check toggleSalesTax method', () => {
    it('should open confirmation dialog if toggle is true', () => {
      component.toggleSalesTax(true);
      expect(component.paymentForm.overrideTotalNonInstalledPartsAccessoriesLabor).toBe(true);
      expect(component.showAmountChangePopup).toBe(true);
    });
    it('should check with false value', () => {
      component.details.taxes = [];
      component.toggleSalesTax(false);
      expect(component.paymentForm.isSalesOtherTaxOverridden).toBe(false);
    });
  });


  describe('should check toggleTotalDownPayment method', () => {
    it('should open confirmation dialog if toggle is true', () => {
      component.toggleTotalDownPayment(true);
      expect(component.paymentForm.isTotalCashDownOverridden).toBe(true);
    });
    it('should check with false value', () => {
      component.details.taxes = [];
      component.toggleTotalDownPayment(false);
      expect(component.paymentForm.isTotalCashDownOverridden).toBe(false);
    });
  });

  it('should emit valuesChanged event when dialog result is truthy', () => {
    const modalSpy = jest.spyOn(modalService, 'open');
    const dialogRefMock: any = {
      afterClosed: jest.fn().mockReturnValue(of([{
        'numOrder': 1,
        'isRefundable': true,
        'paymentMethod': 1,
        'paymentDate': '2023-12-11T07:56:16.149Z',
        'isProcessed': false,
        'amount': 34,
        'lastDate': '2024-02-14T07:56:16.149Z',
        'numOfDays': 65
      }])),
    };
    modalSpy.mockReturnValue(dialogRefMock);

    const emitSpy = jest.spyOn(component.valuesChanged, 'emit');
    const mockEventMethod = jest.spyOn(component.calculateWorksheetDetails, 'emit');

    component.openDepositDialog();

    dialogRefMock.afterClosed().subscribe(() => {
      expect(emitSpy).toHaveBeenCalledWith({
        details: component.details,
        deposits: [{ isRefundable: true }],
      });
      expect(mockEventMethod).toHaveBeenCalledWith();
    });
  });

  it('should check gotoCustomerAddressTab method', () => {
    const mockRouter = jest.spyOn(router,  'navigateByUrl');
    component.gotoCustomerAddressTab();
    expect(mockRouter).toHaveBeenCalled();
  });

  it('should check isDisable', () => {
    component.details.taxes = [];
    expect(component.isDisable).toBe(true);
  });
});
