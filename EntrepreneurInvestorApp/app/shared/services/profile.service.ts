import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { VerifyOtpComponent } from '../components/profile/personal-details/verify-otp/verify-otp.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userProfileData = new Subject<any>();

  constructor(private commonHttpService: CommonHttpService) { }

  reloadProfileData(data) {
    this.userProfileData.next(data);
  }

  getUpdatedProfiledata(): Observable<any> {
    return this.userProfileData.asObservable();
  }

  async getProfile() {
    return this.commonHttpService.get('profile').toPromise();
  }

  async updateProfile(profile: any) {
    const updatedProfile = await this.getProfile()
    return this.commonHttpService.patch('profile', {
      version: updatedProfile.version,
      ...profile
    }).toPromise()
  }

  requestOTPForUpdate(data) {
    return this.commonHttpService.patch('profile/update', data).toPromise();
  }

  resendOtp(data){
    return this.commonHttpService.patch('profile/resend', data).toPromise();
  }

  verifyOtp(data){
    return this.commonHttpService.patch('profile/verify', data).toPromise();
  }
 
}
