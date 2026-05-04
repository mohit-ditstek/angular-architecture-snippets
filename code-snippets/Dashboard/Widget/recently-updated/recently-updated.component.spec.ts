import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EventService, MockEventService } from '@app/shared/services';
import { MockDashboardFacade, MockPermissionService, PermissionService } from '@app/store/user';
import { DashboardFacade } from '../../state/dashboard.facade';
import { RecentlyUpdatedComponent } from './recently-updated.component';
import { of } from 'rxjs';
import { NotificationTopic } from '@app/entities';

describe('RecentlyUpdatedComponent', () => {
  let component: RecentlyUpdatedComponent;
  let fixture: ComponentFixture<RecentlyUpdatedComponent>;
  let dashboardFacade: DashboardFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentlyUpdatedComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: DashboardFacade, useValue: MockDashboardFacade },
        { provide: PermissionService, useValue: MockPermissionService },
        { provide: EventService, useValue: {...MockEventService, realTimeDataObservable$: of({topic: NotificationTopic.CustomerUpdated})} },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dashboardFacade = TestBed.inject(DashboardFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should handle widgetConfigs column index', () => {
    it('should check leads column index', () => {
      const mockSpyMethod = jest.spyOn(component, 'getRecentlyUpdatedLeads');
      component.widgetConfigs[0].callback();
      expect(mockSpyMethod).toHaveBeenCalled();
    });
    it('should check quote column index', () => {
      const mockSpyMethod = jest.spyOn(component, 'getRecentlyUpdatedQuotes');
      component.widgetConfigs[1].callback();
      expect(mockSpyMethod).toHaveBeenCalled();
    });
    it('should check credit column index', () => {
      const mockSpyMethod = jest.spyOn(component, 'getRecentlyUpdatedCreditApps');
      component.widgetConfigs[2].callback();
      expect(mockSpyMethod).toHaveBeenCalled();
    });
    it('should check deals column index', () => {
      const mockSpyMethod = jest.spyOn(component, 'getRecentlyUpdatedDeals');
      component.widgetConfigs[3].callback();
      expect(mockSpyMethod).toHaveBeenCalled();
    });
    it('should check lender column index', () => {
      const mockSpyMethod = jest.spyOn(component, 'getRecentlyUpdatedProducts');
      component.widgetConfigs[4].callback();
      expect(mockSpyMethod).toHaveBeenCalled();
    });

  });
  it('should getRecentlyUpdatedLeads method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getRecentlyUpdatedLeads');
    component.getRecentlyUpdatedLeads();
    expect(spy).toBeCalled();
  });
  it('should getRecentlyUpdatedDeals method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getRecentlyUpdatedDeals');
    component.getRecentlyUpdatedDeals();
    expect(spy).toBeCalled();
  });
  it('should getRecentlyUpdatedProducts method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getRecentlyUpdatedProducts');
    component.getRecentlyUpdatedProducts();
    expect(spy).toBeCalled();
  });

  it('should getRecentlyUpdatedCreditApps method is called', () => {
    const spy = jest.spyOn(dashboardFacade, 'getRecentlyUpdatedCreditApps');
    component.getRecentlyUpdatedCreditApps();
    expect(spy).toBeCalled();
  });
});
