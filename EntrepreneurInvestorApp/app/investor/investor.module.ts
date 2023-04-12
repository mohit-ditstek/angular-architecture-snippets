import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultDashboardComponent } from './components/default-dashboard/default-dashboard.component';
import { InvestorRoutingModule } from './investor-routing.module';
import { TrendingEnterpreneurComponent } from './components/default-dashboard/trending-enterpreneur/trending-enterpreneur.component';
import { ProfileDashboardComponent } from './components/profile-dashboard/profile-dashboard.component';
import { RecommendedEntreprenuerComponent } from './components/profile-dashboard/recommended-entreprenuer/recommended-entreprenuer.component';
import { SharedModule } from '../shared/shared.module';
import { RecommendedCompaniesComponent } from './components/recommended-companies/recommended-companies.component';
import { AddInvestmentComponent } from './components/add-investment/add-investment.component';
import { FinancialRequirementsComponent } from './components/add-investment/financial-requirements/financial-requirements.component';
import { SectorRequirementsComponent } from './components/add-investment/sector-requirements/sector-requirements.component';
import { CompanyDetailsComponent } from './components/recommended-companies/company-details/company-details.component';
import { StageRequirementsComponent } from './components/add-investment/stage-requirements/stage-requirements.component';
import { InvestorMentorsComponent } from './components/profile-dashboard/investor-mentors/investor-mentors.component';
import { InvestmentProfileSummaryComponent } from './components/default-dashboard/investment-profile-summary/investment-profile-summary.component';
import { InvestorRecommendedCompaniesComponent } from './components/profile-dashboard/investor-recommended-companies/investor-recommended-companies.component';
import { InvestorInvestmentOpportunitiesComponent } from './components/profile-dashboard/investor-investment-opportunities/investor-investment-opportunities.component';
import { InvestmentJourneySummaryComponent } from './components/default-dashboard/investment-journey-summary/investment-journey-summary.component';
import { InvestmentProfileListingComponent } from './components/investment-profile-listing/investment-profile-listing.component';
import { InvestmentProfileComponent } from './components/investment-profile-listing/investment-profile/investment-profile.component';
import { InvestmentsMadeListingComponent } from './components/investments-made-listing/investments-made-listing.component';
import { InvestmentMadeComponent } from './components/investments-made-listing/investment-made/investment-made.component';



@NgModule({
  declarations: [
    DefaultDashboardComponent,
    TrendingEnterpreneurComponent,
    ProfileDashboardComponent,
    RecommendedEntreprenuerComponent,
    RecommendedCompaniesComponent,
    AddInvestmentComponent,
    FinancialRequirementsComponent,
    SectorRequirementsComponent,
    StageRequirementsComponent,
    InvestmentProfileSummaryComponent,
    CompanyDetailsComponent,
    StageRequirementsComponent,
    InvestorMentorsComponent,
    InvestorRecommendedCompaniesComponent,
    InvestorInvestmentOpportunitiesComponent,
    InvestmentJourneySummaryComponent,
    InvestmentProfileListingComponent,
    InvestmentProfileComponent,
    InvestmentsMadeListingComponent,
    InvestmentMadeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    InvestorRoutingModule,
  ],
  providers: [
    DatePipe
  ]
})
export class InvestorModule { }
