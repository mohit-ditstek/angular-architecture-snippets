import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';
import { InvestmentJourneyService } from 'src/app/shared/services/investment-journey.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TgtDrawerComponent } from 'src/app/ui-component/components/tgt-drawer/tgt-drawer.component';
import { InvestorService } from '../../services/investor.service';

export interface ViewOptions {
  sortBy: string;
  sortOrder: string;
  pageNumber: number;
  pageSize: number;
}
@Component({
  selector: 'app-recommended-companies',
  templateUrl: './recommended-companies.component.html',
  styleUrls: ['./recommended-companies.component.scss']
})
export class RecommendedCompaniesComponent implements OnInit {

  
  @ViewChild(TgtDrawerComponent) public drawer: TgtDrawerComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator
  investmentProfileId = ''
  investmentProfile = null
  totalRecommendations: number = 0
  recommendedCompanies: Array<any>
  connectedCompanies: Array<any>
  displayedColumns: string[] = ['companyCode', 'foundingYear', 'amount', 'equity', 'founders', 'currentValuation', 'rating', 'connection'];
  isLoading: boolean = true
  selectedCompany = null
  

  constructor(
    private route: ActivatedRoute, 
    private investorService: InvestorService,
    private router: Router,
    private investmentJourneyService: InvestmentJourneyService,
    private notificationService: NotificationService,
    private toasterService: ToasterService
  ) { }

  async ngOnInit() {
    const investmentProfileId = this.route.snapshot.paramMap.get('investmentProfileId')
    this.investmentProfileId = investmentProfileId
    try{
      const [
        investmentProfile
      ] = await Promise.all([
        this.investorService.getInvestmentProfile(investmentProfileId).toPromise(),
        this.refreshConnectedCompanies(),
        this.refreshRecommendedCompanies()
      ])
      this.investmentProfile = investmentProfile
    }catch(e){
      this.router.navigate(['investor'])
    }
    this.isLoading = false
    
  }

  ngAfterViewInit(){
    this.paginator.page.subscribe(() => this.refreshRecommendedCompanies())
    this.sort.sortChange.subscribe(() =>  this.refreshRecommendedCompanies());
  }

  

  async refreshRecommendedCompanies() {
    const response = await this.getRecommendedCompanies(this.getCurrentTableOptions()).toPromise()
    this.recommendedCompanies = response.data
    this.totalRecommendations = response.count
  }

  async refreshConnectedCompanies() {
    this.connectedCompanies = await this.investorService.getConnectedCompanies(this.investmentProfileId).toPromise()
  }

  displayCompanyDetails(companyId){
    this.selectedCompany = this.recommendedCompanies.find(company => companyId === company.companyId)
    this.drawer.open()
    this.notificationService.createNotification({
      type: 'COMPANY_VIEWED',
      companyId
    }).toPromise()
  }

  getRecommendedCompanies(options: ViewOptions){
    return this.investorService.getRecommendedCompanies(this.investmentProfileId, options)
  }

  getCurrentTableOptions(): ViewOptions {
    return {
      sortBy: this.sort?.active || 'amount',
      sortOrder: this.sort?.direction.toUpperCase() || 'ASC',
      pageNumber: this.paginator?.pageIndex + 1|| 1,
      pageSize: this.paginator?.pageSize || 10
    };
  }

  onDrawerClose(){
    this.selectedCompany = null
  }

  onConnect(ioId, ipId){
    this.investmentJourneyService.create(ioId, ipId).subscribe(res => {
     this.refreshRecommendedCompanies()
     this.drawer.close()
     this.toasterService.showSuccess('Connection Request Sent!', 'Success')
    },err=>{
      this.toasterService.showError(Utils.getErrorMessage(err),"Error");
    })
  }

  onConnectWrapper({ioId, ipId}) {
    this.onConnect(ioId, ipId)
  }

  onWithdraw(investmentJourneyId){
    this.investmentJourneyService.withdrawConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedCompanies()
      this.drawer.close()
      this.toasterService.showInfo('Connection Request Withdrawn!', 'Success')
     },err=>{
      this.toasterService.showError(Utils.getErrorMessage(err),"Error");
    })
  }

  onAccept(investmentJourneyId){
    this.investmentJourneyService.acceptConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedCompanies()
      this.refreshConnectedCompanies()
      this.drawer.close()
      this.toasterService.showSuccess('Connection Request Accepted!', 'Success')
     },err=>{
      this.toasterService.showError(Utils.getErrorMessage(err),"Error");
    })
  }

}
