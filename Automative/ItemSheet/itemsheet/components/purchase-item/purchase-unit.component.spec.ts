import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseUnit } from '@app/entities';
import { EventService, IdleService, MockEventService, MockIdleService } from '@app/shared/services';
import { MockFormMethods } from '@app/shared/testing';
import { DealFacade, MockDealFacade, MockWorkSheetFacade, WorksheetFacade } from '@app/store/deal';
import { MockUserFacade, UserFacade } from '@app/store/user';
import { of } from 'rxjs';
import { PurchaseUnitComponent } from './purchase-unit.component';

describe('PurchaseUnitComponent', () => {
  jest.spyOn(global, 'setTimeout');
  jest.useFakeTimers();
  let component: PurchaseUnitComponent;
  let fixture: ComponentFixture<PurchaseUnitComponent>;
  let worksheetFacade: WorksheetFacade;
  let userFacade: UserFacade;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseUnitComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DealFacade,
          useValue: MockDealFacade,
        },
        { provide: WorksheetFacade, useValue: { ...MockWorkSheetFacade , hasCustomerJurisdictionType$: of(true) } },

        {
          provide: EventService,
          useValue: MockEventService,
        },
        {
          provide: IdleService,
          useValue: MockIdleService,
        },
        {
          provide: UserFacade, useValue: {
            ...MockUserFacade, hasChangedCustomerAddress$: of(true)
          }
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseUnitComponent);
    component = fixture.componentInstance;
    userFacade = TestBed.inject(UserFacade);
    worksheetFacade = TestBed.inject(WorksheetFacade);
    fixture.detectChanges();
  });

  it('should ...', () => {
    component.unitComponent = MockFormMethods;
    expect(component).toBeTruthy();
  });
  it('should check valuesChanged method', () => {
    const mockUpdatePurchaseUnitDetails = jest.spyOn(worksheetFacade, 'updatePurchaseUnitDetails');
    component.unitComponent = MockFormMethods;
    component.valuesChanged(new PurchaseUnit());
    expect(mockUpdatePurchaseUnitDetails).toHaveBeenCalled();
  });
  it('should check calculateWorksheetDetails method', () => {
    const mockCalculateWorksheetDetails = jest.spyOn(worksheetFacade, 'calculateWorksheetDetails');
    component.unitComponent = MockFormMethods;
    component.calculateWorksheetDetails();
    expect(mockCalculateWorksheetDetails).toHaveBeenCalled();
  });

  it('should handle resetUnit method', () => {
    const spy = jest.spyOn(worksheetFacade, 'resetUnit');
    component.unitComponent = MockFormMethods;
    component.resetUnit(12);
    expect(spy).toHaveBeenCalled();
  });

  it('should check updateTaxProfileType method', () => {
    const mockEventMethod = jest.spyOn(worksheetFacade, 'updateTaxProfileType');
    component.unitComponent = MockFormMethods;
    component.taxProfileChanged(13,2);
    expect(mockEventMethod).toHaveBeenCalled();
  });
});
