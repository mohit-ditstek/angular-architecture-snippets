import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { UserDetail } from 'src/app/authentication/models/user-model';
import { PageRequest } from 'src/app/core/models/page-request';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { InvestmentService } from '../../services/investment.service';

@Component({
  selector: 'app-investments-made-listing',
  templateUrl: './investments-made-listing.component.html',
  styleUrls: ['./investments-made-listing.component.scss']
})
export class InvestmentsMadeListingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  investmentsMadeList: Array<any> = []
  entityType: string = 'PROFILE';
  profileId: any
  userDetail: UserDetail;
  totalCount: number = 0;
  pageRequest = new PageRequest();
  constructor(private investmentService: InvestmentService,
    private authService: AuthenticationService,) { }

  ngOnInit(): void {
    this.userDetail = this.authService.getUserDetails();
    this.profileId = this.userDetail['profileId'];
    this.loadInvestmentsMade()
  }
  ngAfterViewInit(){
    this.paginator?.page.subscribe(() => this.loadInvestmentsMade())
  }

  onChange(){
    this.loadInvestmentsMade()
  }

  loadInvestmentsMade(){
    this.pageRequest.pageNumber =  this.paginator?.pageIndex + 1 || 1,
    this.pageRequest.pageSize =  this.paginator?.pageSize || 25;
    this.investmentService.getInvestmentJourneySummary(this.pageRequest).subscribe(res => {
      this.investmentsMadeList = res['data'] || [];
      this.totalCount = res.count;
    });
  }
}
