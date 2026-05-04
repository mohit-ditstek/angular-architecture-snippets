import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { EventService, MockDialogService, MockEventService, MockUtilityService, ModalService, UtilityService } from '@app/shared/services';
import { IntegrationManagementFacade, MockIntegrationManagementFacade } from '@app/store/integration-management';
import { MockDashboardFacade, MockPermissionService, PermissionService } from '@app/store/user';
import { CalendarType } from '../../enum';
import { WidgetFilterModel } from '../../model';
import { DashboardFacade } from '../../state/dashboard.facade';
import { QuickLinksComponent } from './quick-links.component';
import { CustomerFacade } from '@app/store/quote';
import { MockCustomerFacade } from '@app/store/customer';
import { Router } from '@angular/router';
import { MockRouterService } from '@app/shared/testing';
import { of } from 'rxjs';
import { NotificationTopic } from '@app/entities';

describe('QuickLinksComponent', () => {
  let component: QuickLinksComponent;
  let fixture: ComponentFixture<QuickLinksComponent>;
  let modalService: ModalService;
  let dashboardFacade: DashboardFacade;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickLinksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalService, useValue: MockDialogService },
        { provide: CustomerFacade, useValue: MockCustomerFacade },
        { provide: PermissionService, useValue: MockPermissionService },
        { provide: DashboardFacade, useValue: MockDashboardFacade },
        { provide: IntegrationManagementFacade, useValue: MockIntegrationManagementFacade },
        { provide: EventService, useValue: {...MockEventService, realTimeDataObservable$: of({type: NotificationTopic.CustomerUpdated })} },
        { provide: Router, useValue: MockRouterService },
        { provide: UtilityService, useValue: MockUtilityService },
      ],
      imports: [TranslateModule.forRoot({}), StoreModule.forRoot({}), RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    modalService = TestBed.inject(ModalService);
    dashboardFacade = TestBed.inject(DashboardFacade);
    router = TestBed.inject(Router);
  });

  it('should ...', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle dealerWidgetConfigs column index', () => {
    it('should check leadTitle callBack method', () => {
      const mockCaptureLeadDialogMethod = jest.spyOn(component, 'captureLeadDialog');
      const mockGetLeadsCountMethod = jest.spyOn(component, 'getLeadsCount');
      component.dealerWidgetConfigs[0].primaryAction.callback();
      component.dealerWidgetConfigs[0].callback();
      expect(mockCaptureLeadDialogMethod).toHaveBeenCalled();
      expect(mockGetLeadsCountMethod).toHaveBeenCalled();
    });
    it('should check quoteTitle callBack method', () => {
      const mockGetQuoteCountMethod = jest.spyOn(component, 'getQuotesCount');
      component.dealerWidgetConfigs[1].callback();
      expect(mockGetQuoteCountMethod).toHaveBeenCalled();
    });
    it('should check creditAppTitle callBack method', () => {
      const mockCaptureAppDialogMethod = jest.spyOn(component, 'captureAppDialog');
      const mockGetCreditAppsCountMethod = jest.spyOn(component, 'getCreditAppsCount');
      component.dealerWidgetConfigs[2].primaryAction.callback();
      component.dealerWidgetConfigs[2].callback();
      expect(mockCaptureAppDialogMethod).toHaveBeenCalled();
      expect(mockGetCreditAppsCountMethod).toHaveBeenCalled();
    });
    it('should check getDealsCount callBack method', () => {
      const mockGetDealsCountMethod = jest.spyOn(component, 'getDealsCount');
      component.dealerWidgetConfigs[3].callback();
      expect(mockGetDealsCountMethod).toHaveBeenCalled();
    });
    it('should check productTitle callBack method', () => {
      const mockGetRemittanceCountMethod = jest.spyOn(component, 'getRemittanceCount');
      component.dealerWidgetConfigs[4].callback();
      expect(mockGetRemittanceCountMethod).toHaveBeenCalled();
    });
    it('should check paymentTitle callBack method', () => {
      const mockOpenPaymentCalculateDialogMethod = jest.spyOn(component, 'openPaymentCalculateDialog');
      component.dealerWidgetConfigs[5].secondaryAction.callback();
      expect(mockOpenPaymentCalculateDialogMethod).toHaveBeenCalled();
    });
  });

  describe('should handle adminWidgetConfigs column index', () => {
    it('should check manageOrg callBack method', () => {
      const mockGetOrgCountMethod = jest.spyOn(component, 'getOrgsCount');
      component.adminWidgetConfigs[0].callback();
      expect(mockGetOrgCountMethod).toHaveBeenCalled();
    });
    it('should check manageUser callBack method', () => {
      const mockGetUsersCountMethod = jest.spyOn(component, 'getUsersCount');
      component.adminWidgetConfigs[1].callback();
      expect(mockGetUsersCountMethod).toHaveBeenCalled();
    });
   
  });

  describe('should check calculateDate method scenarios', () => {
    it('should check with weekly type', () => {
      const payload = {calendarType: CalendarType.Weekly};
      component.calculateDate(payload);
      expect(component.filter.calendarType).toEqual(CalendarType.Weekly);
    });
    it('should check with monthly type', () => {
      const payload = {calendarType: CalendarType.Monthly};
      component.calculateDate(payload);
      expect(component.filter.calendarType).toEqual(CalendarType.Monthly);
    });
    it('should check with annually type', () => {
      const payload = {calendarType: CalendarType.Annually};
      component.calculateDate(payload);
      expect(component.filter.calendarType).toEqual(CalendarType.Annually);
    });
    it('should check with custom type', () => {
      const payload = {calendarType: CalendarType.Custom};
      component.calculateDate(payload);
      expect(component.filter.calendarType).toEqual(CalendarType.Custom);
    });
  });

  it('should getLeadsCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getLeadsCount');
    component.getLeadsCount();
    expect(spy).toBeCalled();
  });

  it('should getQuotesCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getQuotesCount');
    component.getQuotesCount();
    expect(spy).toBeCalled();
  });
  it('should getCreditAppsCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getCreditAppsCount');
    component.getCreditAppsCount();
    expect(spy).toBeCalled();
  });
  it('should getDealsCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getDealsCount');
    component.getDealsCount();
    expect(spy).toBeCalled();
  });

  it('should getRemittanceCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getRemittanceCount');
    component.getRemittanceCount();
    expect(spy).toBeCalled();
  });

  it('should filterChanged method is called', () => {
    const widgetFilterModel: WidgetFilterModel = {
      startDate: new Date(),
      endDate: new Date(),
      calendarType: CalendarType.Annually,
    };
    expect(component.filterChanged(widgetFilterModel)).toBeFalsy();
  });
  it('should check redirect method', () => {
    const mockRouter = jest.spyOn(router, 'navigateByUrl');
    component.redirect('/deals');
    expect(mockRouter).toHaveBeenCalled();
  });
  it('should check redirectPage method', () => {
    const mockRouter = jest.spyOn(router, 'navigateByUrl');
    component.redirectPage('/deals');
    expect(mockRouter).toHaveBeenCalled();
  });
  it('should captureLeadDialog method is called', () => {
    const spy = jest.spyOn(modalService, 'open');
    component.captureLeadDialog();
    expect(spy).toBeCalled();
  });

  it('should captureAppDialog method is called', () => {
    const spy = jest.spyOn(modalService, 'open');
    component.captureAppDialog();
    expect(spy).toBeCalled();
  });
  it('should captureAppDialog method is called', () => {
    const spy = jest.spyOn(modalService, 'open');
    component.openPaymentCalculateDialog();
    expect(spy).toBeCalled();
  });

  it('should getOrgsCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getOrgsCount');
    component.getOrgsCount();
    expect(spy).toBeCalled();
  });
  it('should getUsersCount method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getUsersCount');
    component.getUsersCount();
    expect(spy).toBeCalled();
  });
});
