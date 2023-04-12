import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { StorageKeys } from 'src/app/core/util/storage-keys';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserDetail } from '../../models/user-model'
import { UserService } from '../../services/user.service';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  step: number = 0;
  dynamicEmailExpiryTime:any
  dynamicMobileExpiryTime:any
  user: UserDetail = {
    roles: [],
    email: "",
    name: "",
    mobile: 0,
    isEmailVerified: false,
    isMobileVerified: false,
    profileId: 0
  };
  selectedRoleData: any = {};

  constructor(
    public dialog: MatDialog, 
    public router: Router, 
    private authService: AuthenticationService, 
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfileService
  ) {
    let checkVerify = this.route.snapshot.paramMap.get('verify');
    let user = authService.getUserDetails()
    if (checkVerify == "verify" && user) {
      const rolesImages = this.userService.getRoleImages();
      const selectedRolemage = rolesImages[this.authService.getSelectedRole()] || rolesImages["ROLE_ENTREPRENEUR"] ;
      this.user = { ...user, name: "" }
      this.selectedRoleData["logoImage"] = selectedRolemage.imagePath;
      this.step = 2;
    }
  }

  ngOnInit(): void {
  }

  submit(userData) {
    switch (userData.action) {
      case "role": {
        this.selectedRoleData = userData.selectedRole;
        this.step = 1;
        break;
      }
      case "details": {
        const { user } = userData;
        const { email, name, mobile} = user
        this.dynamicEmailExpiryTime = userData.dynamicExpiryTime.emailExpiryTime
        this.dynamicMobileExpiryTime = userData.dynamicExpiryTime.mobileExpiryTime
        this.user = { ...this.user, email, name, mobile }
        this.step = 2;
        break;
      }
      case "skip": {
        this.step = 3;
        break;
      }
      case "proceed": {
        this.refreshTokenAndShowWelcomeScreen();
        break;
      }
      default: {
        this.step = 0;
        break;
      }
    }
  }

  welcomeScreen() {
    const userType = this.authService.getSelectedRole()
    const dialogRef = this.dialog.open(WelcomeComponent, {
      width: '100%',
      maxWidth: '1024px',
      data: { userType }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(this.authService.getLandingPageRoute());
        this.profileService.reloadProfileData(true);
        this.authService.setUserProfileImage("assets/images/default-avatar.jpeg",this.user?.name)
    });
  }

  refreshTokenAndShowWelcomeScreen() {
    this.authService.refreshToken().subscribe(
      res => this.welcomeScreen(),
      err => this.toasterService.showError("Something went wrong!", "Error")
    )
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
