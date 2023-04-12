import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { Company, CompanyRequest } from '../models/company';
import { AGRI_BIO, BIO_MANURE, BIO_PRIME, BIO_PRIME_IDEA } from './mocks/companies';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companyList = new BehaviorSubject<any>(null);

  constructor(
    private commonHttpService: CommonHttpService,
    private authService: AuthenticationService
  ) { }

  getStaticCompanies(): Array<Company> {
    return [
      BIO_PRIME,
      BIO_MANURE,
      AGRI_BIO,
      BIO_PRIME_IDEA
    ]
  }

  updateCompanytList(data) {
    this.companyList.next(data);
  }

  getCompanyList(): Observable<any> {
    return this.companyList.asObservable();
  }

  getCompanies() {
    return this.commonHttpService.get('company')
  }

  getCompaniesAndIdeas(request) {
    const params = new HttpParams()
      .set('pageNumber', `${request.pageNumber}`)
      .set('pageSize', `${request.pageSize}`)
    return this.commonHttpService.get('company/companiesAndIdeas?' + `${params}`).pipe(map((res) => {
      return res;
    }));
  }

  getCompanyById(id): Company {
    return BIO_PRIME
  }

  fetchCompanyById(id): Observable<CompanyRequest> {
    return this.commonHttpService.get(`company/${id}`)
  }

  getCompanyTypes() {
    return this.commonHttpService.get('companyType')
  }

  getCompanySectorList() {
    return this.commonHttpService.get('sectors')
  }

  getCompanyStages() {
    return this.commonHttpService.get('stages')
  }

  createCompany(company: CompanyRequest) {
    return this.commonHttpService.post('company', company, {})
  }

  async updateCompany(id, company) {
    const updatedCompany = await this.fetchCompanyById(id).toPromise()
    return this.commonHttpService.patch(`company/${id}`, {
      version: updatedCompany.version,
      ...company
    }).toPromise()
  }

  getInvestmentJourneyForCompany(id) {
    return this.commonHttpService.get(`company/${id}/investmentJourney`)
  }

  getInvestmentOpportunitiesForCompany(id, param) {
    const params = new HttpParams()
      .set('pageNumber', `${param.pageNumber}`)
      .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`company/${id}/investmentOpportunity?${params}`)
  }

  getConnectedInvestors(id){
    return this.commonHttpService.get(`company/${id}/connectedInvestor`)
  }

  getRecommendedInvestors(id, options = {
    sortBy: 'companiesInvested',
    sortOrder: 'ASC',
    pageSize: 5,
    pageNumber: 1
  }){
    const {
      sortBy,
      sortOrder,
      pageSize,
      pageNumber
    } = options
    const sortQuery = sortBy && sortOrder ? `&sortBy=${sortBy}&sortOrder=${sortOrder}&pageSize=${pageSize}&pageNumber=${pageNumber}` : ''
    const userRole = this.authService.getSelectedRole()
    const userDetails = this.authService.getUserDetails()
    return this.commonHttpService.get(`company/${id}/recommendedInvestor?${sortQuery}`).pipe(map(res => {
      const investors = res?.data
      return {
        count: res?.count,
        data: investors.map(investor => {
          let requestStatus = ''
          let requestSentByMe = false
          const ijDetails = investor.riIjDto
          if (ijDetails) {
            if (ijDetails.status === 'CONNECTION_REQUESTED') {
              if (ijDetails.createdByRole === userRole) {
                requestSentByMe = ijDetails.createdBy === userDetails.profileId
                requestStatus = 'REQUEST_SENT'
              } else {
                requestStatus = 'REQUEST_RECEVIED'
              }
            }
            if (ijDetails.status === 'IN_PROGRESS') {
              requestStatus = 'REQUEST_ACCEPTED'
            }
          }
          return {
            ...investor,
            requestStatus,
            requestSentByMe
          }

        })
      }
    }))
  }

  prepareGrowthStage(currentGrowthStage, growthStages) {
    let activeIndex = growthStages.findIndex(x => x.name == currentGrowthStage)
    activeIndex = activeIndex == -1 ? growthStages.length - 1 : activeIndex;
    
    let growthStageMilstone = growthStages.map((data, index) => {
      return {
        hasAchieved: index < activeIndex ? true : false,
        label: data.name
      }
    });
    return growthStageMilstone;
  }

  getWidgetData(id){
    return this.commonHttpService.get(`company/${id}/widgetData`);
  }
}