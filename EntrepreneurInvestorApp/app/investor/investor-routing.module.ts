import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../shared/components/calendar/calendar.component';
import { ChubCollaborationListingComponent } from '../shared/components/chub-collaboration-listing/chub-collaboration-listing.component';
import { ChubCollaborationComponent } from '../shared/components/chub-collaboration/chub-collaboration.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { RecentDealsListingComponent } from '../shared/components/recent-deals-listing/recent-deals-listing.component';
import { SettingsComponent } from '../shared/components/settings/settings.component';
import { DefaultDashboardComponent } from './components/default-dashboard/default-dashboard.component';
import { InvestmentProfileListingComponent } from './components/investment-profile-listing/investment-profile-listing.component';
import { InvestmentsMadeListingComponent } from './components/investments-made-listing/investments-made-listing.component';
import { ProfileDashboardComponent } from './components/profile-dashboard/profile-dashboard.component';
import { RecommendedCompaniesComponent } from './components/recommended-companies/recommended-companies.component';

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
        component: ProfileDashboardComponent
      },
      {
        path: 'recommended-companies/:investmentProfileId',
        component: RecommendedCompaniesComponent
      },
      {
        path : 'recentDeals',
        component : RecentDealsListingComponent
      },
      {
        path : 'chub/:id',
        component : ChubCollaborationComponent
      },
      {
        path : 'chub',
        component : ChubCollaborationListingComponent
      },
      {
        path : 'investmentProfiles',
        component : InvestmentProfileListingComponent
      },
      {
        path : 'investmentsMade',
        component : InvestmentsMadeListingComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path : 'settings',
        component : SettingsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
