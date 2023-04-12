import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EntrepreneurRoutingModule } from './entrepreneur-routing.module';
import { DefaultDashboardComponent } from './components/default-dashboard/default-dashboard.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { RecommendedInvestorComponent } from './components/company-dashboard/recommended-investor/recommended-investor.component';
import { InvestmentOpportunitiesComponent } from './components/company-dashboard/investment-opportunities/investment-opportunities.component';
import { MentorsComponent } from './components/company-dashboard/mentors/mentors.component';
import { ServiceProvidersComponent } from './components/company-dashboard/service-providers/service-providers.component';
import { SummaryComponent } from './components/default-dashboard/summary/summary.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyComponent } from './components/companies/companies/company.component';
import { MyCompaniesIdeasComponent } from './components/companies/my-companies-ideas/my-companies-ideas.component';
import { AddCompanyFormComponent } from './components/add-company/add-company-form.component';
import { CoreModule } from '../core/core.module';
import { DatePipe } from '@angular/common'
import { TeamComponent } from './components/add-company/team/team.component';
import { ExecutiveComponent } from './components/add-company/team/executive/executive.component';
import { NonDisclosureAgreementComponent } from './components/add-company/non-disclosure-agreement/non-disclosure-agreement.component';
import { CompanyDetailsComponent } from './components/add-company/details/company-details/company-details.component';
import { CompanyDetailsSectorComponent } from './components/add-company/details/company-details-sector/company-details-sector.component';
import { CompanyDetailByTypeComponent } from './components/add-company/details/company-detail-by-type/company-detail-by-type.component';
import { ShareHolderComponent } from './components/add-company/details/company-detail-by-type/share-holder/share-holder.component';
import { FinancialComponent } from './components/add-company/financial/financial.component';
import { DetailsComponent } from './components/add-company/details/details.component';
import { CompanyAddressComponent } from './components/add-company/details/company-address/company-address.component';
import { OperationalMaturityModelComponent } from './components/add-company/operational-maturity-model/operational-maturity-model.component';
import { InvestmentComponent } from './components/add-company/investment/investment.component';
import { CompanyDocumentsComponent } from './components/add-company/company-documents/company-documents.component';
import { GoToMarketComponent } from './components/add-company/go-to-market/go-to-market.component';
import { SalesComponent } from './components/add-company/sales/sales.component';
import { RecommendedInvestorsListingComponent } from './components/company-dashboard/recommended-investors-listing/recommended-investors-listing.component';
import { RecommendedInvestorDetailsComponent } from './components/company-dashboard/recommended-investors-listing/recommended-investor-details/recommended-investor-details.component';
import { CreateNewOpportunityComponent } from './components/company-dashboard/investment-opportunities/create-new-opportunity/create-new-opportunity.component';

@NgModule({
  declarations: [
    DefaultDashboardComponent,
    CompanyDashboardComponent,
    RecommendedInvestorComponent,
    MyCompaniesIdeasComponent,
    CompanyComponent,
    
    InvestmentOpportunitiesComponent,
    MentorsComponent,
    ServiceProvidersComponent,
    SummaryComponent,
    AddCompanyFormComponent,
    CompanyDetailsComponent,
    CompanyDetailsSectorComponent,
    CompanyDetailByTypeComponent,
    ShareHolderComponent,
    TeamComponent,
    ExecutiveComponent,
    FinancialComponent,
    DetailsComponent,
    CompanyAddressComponent,
    NonDisclosureAgreementComponent,
    InvestmentComponent,
    CompanyDocumentsComponent,
    OperationalMaturityModelComponent,
    NonDisclosureAgreementComponent,
    GoToMarketComponent,
    SalesComponent,
    RecommendedInvestorsListingComponent,
    RecommendedInvestorDetailsComponent,
    CreateNewOpportunityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    EntrepreneurRoutingModule
  ],
  providers:[
    DatePipe
  ]
})
export class EntrepreneurModule { }