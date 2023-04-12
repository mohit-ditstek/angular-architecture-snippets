import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDetail } from 'src/app/authentication/models/user-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Enterprenuer } from 'src/app/entrepreneur/models/enterprenuer';
import { EnterprenuerService } from 'src/app/entrepreneur/services/enterprenuer.service';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent implements OnInit {

  userDetail: UserDetail;
  trendingEnterprenuers: Array<Enterprenuer>
  investmentList: Array<any> = [];
  entityType: string = 'PROFILE';
  profileId: any;
  isLoading: boolean = true;

  constructor(
    private authService: AuthenticationService,
    private enterprenuerService: EnterprenuerService,
    public dialog: MatDialog
  ) {
    this.trendingEnterprenuers = this.enterprenuerService.getTrendingEnterprenuer();
    this.userDetail = this.authService.getUserDetails();
  }

  ngOnInit() {
    this.profileId = this.userDetail['profileId'];
  }

  ngAfterViewInit() {
    this.isLoading = false;
  }

}
