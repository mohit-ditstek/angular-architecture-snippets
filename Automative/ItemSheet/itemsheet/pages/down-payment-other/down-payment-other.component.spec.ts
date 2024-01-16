import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownPaymentOtherComponent } from './down-payment-other.component';
import { Router } from '@angular/router';
import { MockRouterService } from '@app/shared/testing';
import { EventService, IdleService, MockEventService, MockIdleService } from '@app/shared/services';
import { DealFacade, MockDealFacade, MockWorkSheetFacade, WorksheetFacade } from '@app/store/deal';
import { OtherPayments, TradeInDetails } from '@app/entities';
import { PipesModule } from '@app/shared/pipes';

describe('DownPaymentOtherComponent', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
  let component: DownPaymentOtherComponent;
  let fixture: ComponentFixture<DownPaymentOtherComponent>;
  let router: Router;
  let worksheetFacade: WorksheetFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownPaymentOtherComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: MockRouterService },
        { provide: EventService, useValue: MockEventService },
        { provide: IdleService, useValue: MockIdleService },
        { provide: WorksheetFacade, useValue: MockWorkSheetFacade },
        { provide: DealFacade, useValue: MockDealFacade },
      ],
      imports: [PipesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownPaymentOtherComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    worksheetFacade = TestBed.inject(WorksheetFacade);
    fixture.detectChanges();

    jest.spyOn(component, 'isFormValid').mockReturnValue(true);
    jest.spyOn(component, 'isFormDirty').mockReturnValue(false);
  });

  it('should ...', () => {
    expect(component).toBeTruthy();
  });
  it('should ngAfterViewInit method', () => {
    const mockMethod = jest.spyOn(component, 'updateFormStatus');
    component.ngAfterViewInit();
    jest.advanceTimersByTime(100);
    expect(mockMethod).toHaveBeenCalled();
  });
  it('should check valueChanged method', () => {
    const mockUpdateOtherPayments = jest.spyOn(worksheetFacade, 'updateOtherPayments');
    const payments = new OtherPayments();
    component.valueChanged(payments);
    expect(mockUpdateOtherPayments).toHaveBeenCalled();
  });
  it('should check calculateWorksheetDetails method', () => {
    const mockCalculateWorksheetDetails = jest.spyOn(worksheetFacade, 'calculateWorksheetDetails');
    component.calculateWorksheetDetails();
    expect(mockCalculateWorksheetDetails).toHaveBeenCalled();
  });
  it('should check tradeInsValuesChanged method', () => {
    const mockUpdateTradeInDetails = jest.spyOn(worksheetFacade, 'updateTradeInDetails');
    const tradeInDetails = new TradeInDetails();
    component.tradeInsValuesChanged(tradeInDetails);
    expect(mockUpdateTradeInDetails).toHaveBeenCalled();
  });
  it('should check tradeInsTrackBy method', () => {
    const result = component.tradeInsTrackBy(1, {...new TradeInDetails(), id: 12});
    expect(result).toBe(12);
  });
  it('should check addTradeIn method', () => {
    const mockRouter = jest.spyOn(router, 'navigateByUrl');
    component.addTradeIn();
    expect(mockRouter).toHaveBeenCalled();
  });
  it('should check reset method', () => {
    const mockResetUnInstalledParts = jest.spyOn(worksheetFacade, 'resetWorksheetChanges');
    component.reset();
    expect(mockResetUnInstalledParts).toHaveBeenCalled();
  });

});
