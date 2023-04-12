import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { CreateNewOpportunityComponent } from './create-new-opportunity/create-new-opportunity.component';

@Component({
  selector: 'app-investment-opportunities',
  templateUrl: './investment-opportunities.component.html',
  styleUrls: ['./investment-opportunities.component.scss']
})
export class InvestmentOpportunitiesComponent implements OnInit {

  @Input() companyId: string;
  @Input() companyDetail: any;

  isLoading: boolean = true
  investmentOpportunitiesData;
  displayedColumns: string[] = ['investment', 'stage', 'equity', 'valuation'];


  constructor(
    private router: Router,
    private companyService: CompanyService,
    private toasterService: ToasterService,
    public dialog: MatDialog,
    public commonService: CommonHttpService
  ) { }

  ngOnInit() {
    this.getOpportunities();
  }

  collaboration(ijId) {
    this.router.navigate([`/entrepreneur/chub/${ijId}`])
  }

  async openFundingModal() {
    const companyDetailForCreatingIO = { ...this.companyDetail }
    companyDetailForCreatingIO.investmentOpportunities = [];
    companyDetailForCreatingIO.isInvestmentRequired = true;
    const fundingDialogRef = this.dialog.open(CreateNewOpportunityComponent, {
      ...largeModalConfig,
      data: {
        company: companyDetailForCreatingIO,
      }
    });
    fundingDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOpportunities();
      }
    });
  }

  async getOpportunities() {
    try {
      const response = await this.companyService.getInvestmentOpportunitiesForCompany(this.companyId, {
        pageNumber: 1,
        pageSize: 5
      }).toPromise()
      this.investmentOpportunitiesData = response.data;
    } catch (e) {
      this.toasterService.showError('Error fetching Investment opportunities', 'Error!')
    } finally {
      this.isLoading = false
    }
  }

}
