import { Component, OnDestroy, OnInit } from '@angular/core';
import { DealStageType, EntityType, FeatureFlag, NotificationTopic, Permission } from '@app/entities';
import { EventService } from '@app/shared/services';
import { PermissionService } from '@app/store/user';
import { Subscription } from 'rxjs';
import { RecentlyUpdatedConfig } from '../../model';
import { DashboardFacade } from '../../state/dashboard.facade';

@Component({
  selector: 'app-recently-updated',
  templateUrl: './recently-updated.component.html',
  styleUrls: ['./recently-updated.component.scss'],
})
export class RecentlyUpdatedComponent implements OnInit , OnDestroy {
  widgetConfigs: RecentlyUpdatedConfig[] = [
    {
      class: 'leads-bg-color',
      caption: 'dashboard.listingTitles.leads',
      idPrefix: EntityType.Lead,
      url: '/leads/{id}',
      data$: this.dashboardFacade.recentlyUpdatedLeads$,
      callback: () => this.getRecentlyUpdatedLeads(),
      requiredFeatureFlag: FeatureFlag.LeadsEnabled,
      requiredPermission: Permission.ViewLeads,
    },
    {
      class: 'quotes-bg-color',
      caption: 'dashboard.listingTitles.quote',
      idPrefix: EntityType.Quote,
      url: '/quotes/{id}',
      data$: this.dashboardFacade.recentlyUpdatedQuotes$,
      callback: () => this.getRecentlyUpdatedQuotes(),
      requiredFeatureFlag: FeatureFlag.QuotesEnabled,
      requiredPermission: Permission.ViewQuotes,
    },
    {
      class: 'credit-app-bg-color',
      caption: 'dashboard.listingTitles.credit',
      idPrefix: EntityType.CreditApp,
      url: '/credit-apps/creditapp/{id}',
      data$: this.dashboardFacade.recentlyUpdatedCreditApplications$,
      callback: () => this.getRecentlyUpdatedCreditApps(),
      requiredFeatureFlag: FeatureFlag.CreditAppsEnabled,
      requiredPermission: Permission.ViewCreditApps,
    },
    {
      class: 'deals-bg-color',
      caption: 'dashboard.listingTitles.deals',
      idPrefix: EntityType.Deal,
      url: '/deals/{id}/customers',
      data$: this.dashboardFacade.recentlyUpdatedDeals$,
      callback: () => this.getRecentlyUpdatedDeals(),
      requiredPermission: Permission.ViewDeals,
    },
    {
      class: 'remittance-bg-color',
      caption: 'dashboard.listingTitles.lender',
      url: '/remittance',
      data$: this.dashboardFacade.recentlyUpdatedRemittance$,
      requiredPermission: Permission.ViewProductsRemittance,
      callback: () => this.getRecentlyUpdatedProducts(),
    },
  ];

  readonly recordsCount = 5;
  private subscription = new Subscription();

  constructor(private permissionService: PermissionService, private dashboardFacade: DashboardFacade, private eventService: EventService) {}

  ngOnInit(): void {
    this.widgetConfigs = this.widgetConfigs.filter((config) => this.permissionService.checkFeatureAvailability(config));
    this.realTimeSubscription();
  }

  getRecentlyUpdatedLeads() {
    this.dashboardFacade.getRecentlyUpdatedLeads(this.recordsCount);
  }

  getRecentlyUpdatedDeals() {
    this.dashboardFacade.getRecentlyUpdatedDeals(this.recordsCount);
  }

  getRecentlyUpdatedQuotes() {
    this.dashboardFacade.getRecentlyUpdatedQuotes(this.recordsCount);
  }

  getRecentlyUpdatedProducts() {
    this.dashboardFacade.getRecentlyUpdatedProducts(this.recordsCount);
  }

  getRecentlyUpdatedCreditApps() {
    this.dashboardFacade.getRecentlyUpdatedCreditApps(this.recordsCount);
  }

  realTimeSubscription() {
    this.subscription.add(
      this.eventService.realTimeDataObservable$.subscribe((response) => {
        if (response) {
          const { topic } = response;
          switch (topic) {
          case NotificationTopic.CustomerUpdated:
            this.getRecentlyUpdatedLeads();
            break;
          case NotificationTopic.CreditAppUpdated:
            this.getRecentlyUpdatedCreditApps();
            break;
          case NotificationTopic.DealUpdated:
            response.payload['stage'] === DealStageType.Deal ? this.getRecentlyUpdatedDeals() : this.getRecentlyUpdatedQuotes();
            break;
          case NotificationTopic.ContractUpdated:
            this.getRecentlyUpdatedProducts();
            break;
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
