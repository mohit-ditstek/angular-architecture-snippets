import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminPermission, CaptureCreditAppDialogData, DealStageType, FeatureFlag, NotificationTopic, OrgType, Permission } from '@app/entities';
import { PaymentCalculatorDialogComponent } from '@app/features/deals/deal-shared';
import { CaptureCreditAppDialogComponent, CaptureLeadAppDialogComponent } from '@app/shared/components';
import { EventService, ModalService, UtilityService } from '@app/shared/services';
import { CustomerFacade } from '@app/store/customer';
import { IntegrationManagementFacade } from '@app/store/integration-management';
import { PermissionService } from '@app/store/user';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CalendarType } from '../../enum';
import { WidgetConfig, WidgetFilterModel } from '../../model';
import { DashboardFacade } from '../../state/dashboard.facade';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
  providers: [CustomerFacade],
})
export class QuickLinksComponent implements OnInit , OnDestroy{
  @Input() orgId: number;
  @Input() orgName: string;
  @Input() isAdmin: boolean;
  @Input() orgType: OrgType;
  dealerWidgetConfigs: WidgetConfig[] = [
    {
      icon: 'person_search',
      title: 'dashboard.tiles.leadTitle',
      caption: 'dashboard.tiles.leadCaption',
      iconColor: 'leads-bg-color',
      description: 'dashboard.tiles.leadDesc',
      featureUrl: '/leads',
      primaryAction: {
        text: 'common.new',
        icon: 'add',
        callback: () => this.captureLeadDialog(),
      },
      requiredFeatureFlag: FeatureFlag.LeadsEnabled,
      requiredPermission: Permission.ViewLeads,
      data$: this.dashboardFacade.leadsCount$,
      callback: () => this.getLeadsCount(),
    },

    {
      icon: 'person_add_alt_1',
      title: 'dashboard.tiles.quoteTitle',
      caption: 'dashboard.tiles.quoteCaption',
      iconColor: 'quotes-bg-color',
      description: 'dashboard.tiles.quoteDesc',
      featureUrl: '/quotes',
      primaryAction: {
        text: 'common.new',
        icon: 'add',
        url: '/quotes/new',
        requiredPermission: Permission.UpdateQuote,
      },
      secondaryAction: {
        text: 'common.import',
        icon: 'upload',
      },
      requiredFeatureFlag: FeatureFlag.QuotesEnabled,
      requiredPermission: Permission.ViewQuotes,
      data$: this.dashboardFacade.quotesCount$,
      callback: () => this.getQuotesCount(),
    },
    {
      icon: 'request_quote',
      title: 'dashboard.tiles.creditAppTitle',
      caption: 'dashboard.tiles.creditAppCaption',
      iconColor: 'credit-app-bg-color',
      description: 'dashboard.tiles.creditAppDesc',
      featureUrl: '/credit-apps',
      primaryAction: {
        text: 'common.new',
        icon: 'add',
        callback: () => this.captureAppDialog(),
      },
      requiredFeatureFlag: FeatureFlag.CreditAppsEnabled,
      requiredPermission: Permission.ViewCreditApps,
      data$: this.dashboardFacade.creditAppsCount$,
      callback: () => this.getCreditAppsCount(),
    },
    {
      icon: 'folder_shared',
      title: 'dashboard.tiles.dealsTitle',
      caption: 'dashboard.tiles.dealsCaption',
      iconColor: 'deals-bg-color',
      description: 'dashboard.tiles.dealsDesc',
      featureUrl: '/deals',
      primaryAction: {
        text: 'common.new',
        icon: 'add',
        url: '/deals/new',
        requiredPermission: Permission.UpdateDeal,
      },
      secondaryAction: {
        text: 'common.import',
        icon: 'upload',
        url: '/dms-import',
        isImport: true,
        requiredPermission: Permission.UpdateDeal,
      },
      data$: this.dashboardFacade.dealsCount$,
      callback: () => this.getDealsCount(),
      requiredPermission: Permission.ViewDeals,
    },
    {
      icon: 'repeat',
      title: 'dashboard.tiles.productTitle',
      caption: 'dashboard.tiles.productCaption',
      iconColor: 'remittance-bg-color',
      description: 'dashboard.tiles.productDesc',
      featureUrl: '/remittance',
      data$: this.dashboardFacade.remittanceCount$,
      callback: () => this.getRemittanceCount(),
      requiredPermission: Permission.ViewProductsRemittance,
    },

    {
      icon: 'calculate',
      title: 'dashboard.tiles.paymentTitle',
      caption: 'dashboard.tiles.leadCaption',
      iconColor: 'payment-bg-color',
      description: 'dashboard.tiles.paymentDesc',
      secondaryAction: {
        text: 'common.calculate',
        icon: 'arrow_forward',
        reverse: true,
        callback: () => this.openPaymentCalculateDialog(),
      },
      requiredPermission: Permission.ViewPaymentCalculator,
    },
  ];
  adminWidgetConfigs: WidgetConfig[] = [
    {
      icon: 'location_on',
      title: 'dashboard.tiles.manageOrg',
      caption: 'dashboard.tiles.active',
      iconColor: 'quotes-bg-color',
      description: 'dashboard.tiles.orgDesc',
      featureUrl: '/orgs',
      requiredPermission: AdminPermission.ViewOrgs,
      data$: this.dashboardFacade.orgsCount$,
      callback: () => this.getOrgsCount(),
    },
    {
      icon: 'group',
      title: 'dashboard.tiles.manageUser',
      caption: 'dashboard.tiles.active',
      iconColor: 'quotes-bg-color',
      description: 'dashboard.tiles.usersDesc',
      featureUrl: '/unique-users',
      requiredPermission: AdminPermission.ViewUniqueUsers,
      data$: this.dashboardFacade.usersCount$,
      callback: () => this.getUsersCount(),
    },
    {
      icon: 'group',
      title: 'dashboard.tiles.manageSuperUser',
      iconColor: 'quotes-bg-color',
      description: 'dashboard.tiles.superUsersDesc',
      featureUrl: '/users',
      requiredPermission: AdminPermission.ViewUsers,
    },
  ];

  filter: WidgetFilterModel = {
    startDate: null,
    endDate: null,
    calendarType: CalendarType.Weekly,
  };

  subscription = new Subscription();

  isDmsEnabled$ = this.integrationManagementFacade.isDmsEnabled$;
  widgetConfigs: WidgetConfig[];
  orgValue: string;

  constructor(
    private modalService: ModalService,
    private customerFacade: CustomerFacade,
    private permissionService: PermissionService,
    private dashboardFacade: DashboardFacade,
    private integrationManagementFacade: IntegrationManagementFacade,
    private eventService: EventService,
    private router: Router,
    private utilityService: UtilityService
  ) {
    this.realTimeSubscription();
  }

  ngOnInit(): void {
    this.setInitialFilter();
    const widgets = this.isAdmin ? this.adminWidgetConfigs : this.dealerWidgetConfigs;
    this.widgetConfigs = widgets.filter((config) => this.permissionService.checkFeatureAvailability(config));
  }

  calculateDate(payload) {
    if (payload.calendarType === CalendarType.Weekly) {
      this.setInitialFilter();
    }

    if (payload.calendarType === CalendarType.Monthly) {
      this.filter = {
        ...this.filter,
        startDate: this.formatDate(moment().startOf('month').set({ hours: 0, minutes: 0 })),
        endDate: this.formatDate(moment().set({ seconds: 0 })),
        calendarType: CalendarType.Monthly,
      };
    }

    if (payload.calendarType === CalendarType.Annually) {
      this.filter = {
        ...this.filter,
        startDate: this.formatDate(moment().startOf('year').set({ hours: 0, minutes: 0 })),
        endDate: this.formatDate(moment().set({ seconds: 0 })),
        calendarType: CalendarType.Annually,
      };
    }

    if (payload.calendarType === CalendarType.Custom) {
      this.filter = {
        ...this.filter,
        startDate: payload.startDate,
        endDate: payload.endDate,
        calendarType: CalendarType.Custom,
      };
    }
  }

  setInitialFilter() {
    this.filter = {
      ...this.filter,
      startDate: this.formatDate(moment().startOf('week').set({ hours: 0, minutes: 0 })),
      endDate: this.formatDate(moment().set({ seconds: 0 })),
      calendarType: CalendarType.Weekly,
    };
  }

  getLeadsCount() {
    this.dashboardFacade.getLeadsCount(this.filter);
  }

  getQuotesCount() {
    this.dashboardFacade.getQuotesCount(this.filter);
  }

  getCreditAppsCount() {
    this.dashboardFacade.getCreditAppsCount(this.filter);
  }

  getDealsCount() {
    this.dashboardFacade.getDealsCount(this.filter);
  }

  getRemittanceCount() {
    this.dashboardFacade.getRemittanceCount(this.filter);
  }

  filterChanged(filter: WidgetFilterModel) {
    this.calculateDate(filter);
    this.getLeadsCount();
    this.getQuotesCount();
    this.getCreditAppsCount();
    this.getDealsCount();
    this.getRemittanceCount();
  }

  redirect(data) {
    this.router.navigateByUrl(data, { state: { dateRange: this.filter } });
  }
  redirectPage(data) {
    this.router.navigateByUrl(data);
  }

  formatDate(value) {
    return this.utilityService.formatDate(value, 'MM/dd/yy');
  }

  captureLeadDialog() {
    const dialogRef = this.modalService.open(CaptureLeadAppDialogComponent, this.orgId, 'modal-md');
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.customerFacade.initiateLead(res);
      }
    });
  }

  captureAppDialog() {
    const data: CaptureCreditAppDialogData = {
      title: 'creditApp.linkSendTitle',
      dealId: null,
      hideTabs: false,
      button: {
        primaryButton: 'common.cancel',
        secondaryButton: 'common.sendLink',
      },
    };
    this.modalService.open(CaptureCreditAppDialogComponent, data, 'modal-md');
  }

  openPaymentCalculateDialog() {
    this.modalService.open(PaymentCalculatorDialogComponent, null, 'modal-lg');
  }

  realTimeSubscription() {
    this.subscription.add(
      this.eventService.realTimeDataObservable$.subscribe((response) => {
        if (response) {
          const { topic } = response;
          // TODO: Need to check if we can prevent api call in update
          // if (action == NotificationAction.Updated) return;

          switch (topic) {
          case NotificationTopic.CustomerUpdated:
            this.getLeadsCount();
            break;
          case NotificationTopic.CreditAppUpdated:
            this.getCreditAppsCount();
            break;
          case NotificationTopic.DealUpdated:
            response.payload['dealStage'] === DealStageType.Deal ? this.getDealsCount() : this.getQuotesCount();
            break;
          case NotificationTopic.ContractUpdated:
            this.getRemittanceCount();
            break;
          }
        }
      })
    );
  }

  getOrgsCount() {
    this.dashboardFacade.getOrgsCount();
  }
  getUsersCount() {
    this.dashboardFacade.getUsersCount();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
