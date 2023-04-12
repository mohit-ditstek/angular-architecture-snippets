import { Component, OnInit } from '@angular/core';
import { InvestmentService } from 'src/app/investor/services/investment.service';
import { PageRequest } from 'src/app/core/models/page-request';

@Component({
  selector: 'app-investment-journey-summary',
  templateUrl: './investment-journey-summary.component.html',
  styleUrls: ['./investment-journey-summary.component.scss']
})
export class InvestmentJourneySummaryComponent implements OnInit {
  investmentJourneySummaryList: Array<any> =  []
  pageRequest = new PageRequest()
  constructor(private investmentService: InvestmentService ) { }

  ngOnInit(): void {
    this.loadInvestmentJourneySummary()
  }
  loadInvestmentJourneySummary() {
    this.pageRequest.pageSize = 3
    this.pageRequest.pageNumber = 1
    this.investmentService.getInvestmentJourneySummary(this.pageRequest).subscribe(res => {
      this.investmentJourneySummaryList = res['data'] || []
    });
  }

}
