import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Company } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { InvestmentJourneyService } from 'src/app/shared/services/investment-journey.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TgtDrawerComponent } from 'src/app/ui-component/components/tgt-drawer/tgt-drawer.component';


@Component({
  selector: 'app-recommended-investors-listing',
  templateUrl: './recommended-investors-listing.component.html',
  styleUrls: ['./recommended-investors-listing.component.scss']
})
export class RecommendedInvestorsListingComponent implements OnInit {

  @ViewChild(TgtDrawerComponent) public drawer: TgtDrawerComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator

  companyDetail: any;
  companyId: any;
  displayedColumns: string[] = ['investorCode', 'sector', 'investmentAppetite', 'designation', 'companiesInvested', 'companiesEngaged', 'currentInvestments', 'totalInvestments', 'connection'];
  pageSize = 10
  totalRecommendations = 0
  recommendedInvestors: Array<any>=[];
  selectedInvestor = null
  isLoading: boolean = true
  myConnectedInvestorsList: Array<any> = []
 
  constructor(
    private companyService: CompanyService, 
    private route: ActivatedRoute, 
    private router: Router,
    private investmentJourneyService: InvestmentJourneyService,
    private toasterService: ToasterService,
    private notificationService: NotificationService
  ) {
  }

  async ngOnInit() {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.companyDetail = await this.companyService.fetchCompanyById(this.companyId).toPromise();
    if (!this.companyDetail?.id) {
      this.router.navigate(['/entrepreneur/dashboard'])
    }
    this.refreshRecommendedInvestors()
    this.getMyConnectedInvestors()
    this.isLoading = false
  }

  ngAfterViewInit(){
    this.paginator.page.subscribe(() => this.refreshRecommendedInvestors())
    this.sort.sortChange.subscribe(() =>  this.refreshRecommendedInvestors());
  }

  getMyConnectedInvestors(){
    this.companyService.getConnectedInvestors(this.companyId).subscribe(res =>{
      this.myConnectedInvestorsList = res || []
    })
  }
  getRecommendedInvestorsData(options){
    return this.companyService.getRecommendedInvestors(this.companyId, options)
  }

  async refreshRecommendedInvestors() {
    const response = await this.getRecommendedInvestorsData(this.getCurrentTableOptions()).toPromise()
    this.recommendedInvestors = response.data
    this.totalRecommendations = response.count
  }

  getCurrentTableOptions() {
    return {
      sortBy: this.sort?.active || 'companiesInvested',
      sortOrder: this.sort?.direction.toUpperCase() || 'ASC',
      pageNumber: this.paginator?.pageIndex + 1|| 1,
      pageSize: this.pageSize
    };
  }

  onConnect(ioId, ipId){
    if(this.companyDetail.investmentOpportunities?.length){
      this.investmentJourneyService.create(ioId, ipId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.drawer.close()
      this.toasterService.showSuccess('Connection Request Sent!', 'Success')
      })
    }
  }

  onConnectWrapper({ ioId, ipId }) {
    this.onConnect(ioId, ipId)
  }

  onWithdraw(investmentJourneyId){
    this.investmentJourneyService.withdrawConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.drawer.close()
      this.toasterService.showInfo('Connection Request Withdrawn!', 'Success')
     })
  }

  onAccept(investmentJourneyId){
    this.investmentJourneyService.acceptConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.getMyConnectedInvestors()
      this.drawer.close()
      this.toasterService.showSuccess('Connection Request Accepted!', 'Success')
     })
  }



  displayInvestmentDetails(investmentProfileId){
    this.selectedInvestor = this.recommendedInvestors.find(investor => investmentProfileId === investor.investmentProfileId)
    this.drawer.open()
    this.notificationService.createNotification({
      type: 'INVESTOR_VIEWED',
      investorId: this.selectedInvestor.investorId,
      companyId: this.companyId 
    }).toPromise()
  }

  onDrawerClose(){
    this.selectedInvestor = null
  }

}
