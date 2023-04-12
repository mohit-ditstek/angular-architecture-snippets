import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDetail } from 'src/app/authentication/models/user-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Company } from '../../models/company';

@Component({
  selector: 'app-enterprenuer-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent implements OnInit {

  userDetail: UserDetail;
  companyList: Array<Company>;
  entityType: string = 'PROFILE';
  profileId: any;
  isLoading: boolean = true;
  subscription: Subscription;



  constructor(
    private authService: AuthenticationService,
    private profileService:ProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.userDetail = this.authService.getUserDetails();
  }

  ngOnInit() {
    this.loadObservables();
    this.profileId = this.userDetail['profileId'];
  }

  ngAfterViewInit() {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  loadObservables() {
    this.subscription = this.profileService.getUpdatedProfiledata().subscribe(res => {
      if(res)
      this.userDetail = this.authService.getUserDetails();
    })
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();

  }

}
