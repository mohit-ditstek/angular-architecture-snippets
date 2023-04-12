import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../shared/components/calendar/calendar.component';
import { ChubCollaborationListingComponent } from '../shared/components/chub-collaboration-listing/chub-collaboration-listing.component';
import { ChubCollaborationComponent } from '../shared/components/chub-collaboration/chub-collaboration.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { RecentDealsListingComponent } from '../shared/components/recent-deals-listing/recent-deals-listing.component';
import { SettingsComponent } from '../shared/components/settings/settings.component';
import { MyCompaniesIdeasComponent } from './components/companies/my-companies-ideas/my-companies-ideas.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { RecommendedInvestorsListingComponent } from './components/company-dashboard/recommended-investors-listing/recommended-investors-listing.component';
import { DefaultDashboardComponent } from './components/default-dashboard/default-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DefaultDashboardComponent,
        data: { createCompany: false, createIdea: false }
      },
      {
        path: 'dashboard/:id',
        component: CompanyDashboardComponent
      },
      {
        path: 'companies',
        component: MyCompaniesIdeasComponent
      },
      {
        path: 'recommended-investors/:id',
        component: RecommendedInvestorsListingComponent
      },
      {
        path: 'recentDeals',
        component: RecentDealsListingComponent
      },
      {
        path: 'chub/:id',
        component: ChubCollaborationComponent
      },
      {
        path: 'chub',
        component: ChubCollaborationListingComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntrepreneurRoutingModule { }
