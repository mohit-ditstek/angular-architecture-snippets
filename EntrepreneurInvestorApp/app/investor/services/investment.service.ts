import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CommonHttpService } from 'src/app/core/services/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private investmentList = new BehaviorSubject<any>(null);

  constructor(private commonHttpService: CommonHttpService) { }

  updateInvestmentList(data) {
    this.investmentList.next(data);
  }

  getInvestmentList(): Observable<any> {
    return this.investmentList.asObservable();
  }

  getInvestmentProfile(param) {
    const params = new HttpParams()
    .set('pageNumber', `${param.pageNumber}`)
    .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`investmentProfile?${params}`)
  }

  createInvestmentProfile(investmentProfile) {
    return this.commonHttpService.post('investmentProfile', investmentProfile)
  }

  fetchInvestmentProfileById(id): Observable<any> {
    return this.commonHttpService.get(`investmentProfile/${id}`)
  }

  async updateInvestmentProfile(id, investmentProfile) {
    const updatedInvestmentProfile = await this.fetchInvestmentProfileById(id).toPromise()
    return this.commonHttpService.patch(`investmentProfile/${id}`, {
      version: updatedInvestmentProfile.version,
      ...investmentProfile
    }).toPromise()
  }

  getInvestmentProfileRecentDeals(id, param) {
    const params = new HttpParams()
      .set('pageNumber', `${param.pageNumber}`)
      .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`investmentProfile/${id}/recentDeals?${params}`)
  }

  getInvestmentProfileRecommendedCompany(id, param) {
    const params = new HttpParams()
      .set('pageNumber', `${param.pageNumber}`)
      .set('pageSize', `${param.pageSize}`)
      .set('sortBy', `${param.sortBy}`)
      .set('sortOrder', `${param.sortOrder}`)

    return this.commonHttpService.get(`investmentProfile/${id}/recommendedCompany?${params}`)
  }

  getConnectionsForInvestmentProfile(id,param){
    const params = new HttpParams()
    .set('pageNumber', `${param.pageNumber}`)
    .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`investmentProfile/${id}/connection?${params}`)
  }

  getInvestmentJourneyForInvestmentProfile(id){
    return this.commonHttpService.get(`investmentProfile/${id}/investmentJourney`)
  }

  getInvestmentJourneySummary(param) {
    const params = new HttpParams()
      .set('pageNumber', `${param.pageNumber}`)
      .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`investmentProfile/investmentMade?${params}`)
  }
}
