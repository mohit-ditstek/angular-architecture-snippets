import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { Investor } from 'src/app/investor/models/investor';
import { InvestmentJourneyService } from 'src/app/shared/services/investment-journey.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TgtDrawerComponent } from 'src/app/ui-component/components/tgt-drawer/tgt-drawer.component';

@Component({
  selector: 'app-recommended-investor',
  templateUrl: './recommended-investor.component.html',
  styleUrls: ['./recommended-investor.component.scss']
})
export class RecommendedInvestorComponent implements OnInit {
  @ViewChild(TgtDrawerComponent) public drawer: TgtDrawerComponent;
  @Input() companyId: string = '';

  recommendedInvestors: Array<Investor>;
  isLoading: boolean = true
  selectedInvestor: any = null;
  constructor(
    private router: Router,
    private companyService: CompanyService,
    private investmentJourneyService: InvestmentJourneyService,
    private toasterService: ToasterService,
    private notificationService: NotificationService
  ) { }

  async ngOnInit() {
    try {
      const response = await this.companyService.getRecommendedInvestors(this.companyId).toPromise()
      this.recommendedInvestors = response.data
    } catch (e) {
      this.toasterService.showError('Error fetching recommended investors', 'Error!')
    } finally {
      this.isLoading = false
    }
  }

  onClickAction(event) {
    if (event === 'View More') {
      this.router.navigate([`/entrepreneur/recommended-investors/${this.companyId}`])
    }
  }

  getRecommendedInvestorsData() {
    return this.companyService.getRecommendedInvestors(this.companyId)
  }

  async refreshRecommendedInvestors() {
    const response = await this.getRecommendedInvestorsData().toPromise()
    this.recommendedInvestors = response.data
  }

  onConnect(ioId, ipId) {
    this.investmentJourneyService.create(ioId, ipId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.drawer.close()
      this.toasterService.showSuccess('Connection Request Sent!', 'Success')
    })
  }

  onConnectWrapper({ ioId, ipId }) {
    this.onConnect(ioId, ipId);
  }

  onWithdraw(investmentJourneyId) {
    this.investmentJourneyService.withdrawConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.drawer.close()
      this.toasterService.showInfo('Connection Request Withdrawn!', 'Success')
    })
  }

  onAccept(investmentJourneyId) {
    this.investmentJourneyService.acceptConnectionRequest(investmentJourneyId).subscribe(res => {
      this.refreshRecommendedInvestors()
      this.drawer.close()
      this.toasterService.showSuccess('Connection Request Accepted!', 'Success')
    })
  }

  displayInvestmentDetails(investmentProfileId) {
    this.selectedInvestor = this.recommendedInvestors.find((investor: any) => investmentProfileId === investor.investmentProfileId)
    this.drawer.open()
    this.notificationService.createNotification({
      type: 'INVESTOR_VIEWED',
      investorId: this.selectedInvestor.investorId,
      companyId: this.companyId
    }).toPromise()
  }

  onDrawerClose() {
    this.selectedInvestor = null
  }

}
