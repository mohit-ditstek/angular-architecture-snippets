import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { environment } from 'src/environments/environment.prod';

interface CreateUserRequest {
  roles: Array<string>,
  name: string,
  email: string,
  mobile: string
}

interface UserVerificationRequest {
  otpReceiver: string,
  otp: number,
  content: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = environment.apiURL;

  constructor(
    private commonHttpService: CommonHttpService, 
    private authService: AuthenticationService
  ) { }

  getRoleImages() {
    const rolesImages = {
      ROLE_ENTREPRENEUR: {
        imagePath: "assets/images/entrepreneur.png"
      },
      ROLE_INVESTOR: {
        imagePath: "assets/images/investor.png"
      },
      ROLE_SERVICE_PROVIDER: {
        imagePath: "assets/images/service-provider.png"
      },
      ROLE_MENTOR: {
        imagePath: "assets/images/mentor.png"
      }
    }
    return rolesImages;
  }

  createUser(createUserRequest:CreateUserRequest) {
    return this.commonHttpService.post('profile', createUserRequest).pipe(map( res => {
      if (res.token) this.authService.setUserTokens(res.token, res.refreshToken)
      return res
    }))
  }

  verifyUser(userVerificationRequest: UserVerificationRequest) {
    return this.commonHttpService.patch('profile/verify', userVerificationRequest).pipe(map( res => {
      if (
        (userVerificationRequest.otpReceiver === 'EMAIL' &&  res.isEmailVerified) ||
        (userVerificationRequest.otpReceiver === 'MOBILE' && res.isMobileVerified)
      ) {
        res["profileId"] = res?.id;
        res["pictureUrl"] = "assets/images/default-avatar.jpeg";
        this.authService.setUserDetails(JSON.stringify(res))
        this.authService.setSelectedRole( res.roles[0])
      } 
      return res
    }))
  }
}
