import { Injectable } from '@angular/core';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenPayload } from '../models/token-payload';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { StorageKeys } from '../util/storage-keys';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { map } from 'rxjs/internal/operators/map';
import { userRoleConfig } from '../config/userConfig'
import { UserDetail } from 'src/app/authentication/models/user-model';
import { ProfileService } from 'src/app/shared/services/profile.service';

interface AuthenticationRequest {
  username: string,
  otp: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public jwtHelper: JwtHelperService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private commonHttpService: CommonHttpService,
    private profileService: ProfileService
  ) { }

  get authorizationHeaderValue(): any {
    let token = this.localStorageService.get(StorageKeys.keys.AUTHTOKEN);
    return token;
  }

  authenticate(request: AuthenticationRequest) {
    return this.commonHttpService.post('authenticate', request).pipe(map(res => {
      if (res.token) {
        this.profileService.reloadProfileData(true);
        let userDetails = {
          ...res, pictureUrl: res?.pictureUrl || "assets/images/default-avatar.jpeg"
        }
        this.setUserDetails(JSON.stringify(userDetails))
        this.setUserTokens(res.token, res.refreshToken)
        if (res.isEmailVerified) {
          this.setSelectedRole(res.roles[0]);
          this.router.navigate(this.getLandingPageRoute());
        } else {
          this.router.navigate(['signup', 'verify']);
        }
      } else {
        this.logout()
      }
    }))
  }

  isAuthenticated(): boolean {
    let isAuthenticated = false;
    try {
      const token = this.localStorageService.get(StorageKeys.keys.AUTHTOKEN);
      isAuthenticated = !this.jwtHelper.isTokenExpired(token)
    } catch (ex) {
      isAuthenticated = false;
    }
    return isAuthenticated;
  }

  isTokenAvaialable(): boolean {
    let isTokenAvaialable = false;
    try {
      const token = this.localStorageService.get(StorageKeys.keys.AUTHTOKEN);
      const refreshToken = this.localStorageService.get(StorageKeys.keys.REFRESHTOKEN)
      isTokenAvaialable = (token && refreshToken) ? true : false;
    } catch (ex) {
      isTokenAvaialable = false;
    }
    return isTokenAvaialable;
  }

  isPrimaryVerificationDone() {
    const payload = this.getUserTokenPayload()
    return payload.isEmailVerified
  }

  getUserRoles(): Array<string> {
    const token = this.localStorageService.get(StorageKeys.keys.AUTHTOKEN);
    const tokenPayload: TokenPayload = decode(token);
    return tokenPayload.roles
  }

  setUserTokens(authToken, refreshToken) {
    this.localStorageService.set(StorageKeys.keys.AUTHTOKEN, authToken);
    this.localStorageService.set(StorageKeys.keys.REFRESHTOKEN, refreshToken);
  }

  setUserDetails(user) {
    this.localStorageService.set(StorageKeys.keys.USERDETAIL, user);
  }

  setUserProfileImage(url = "assets/images/default-avatar.jpeg",name) {
    let userDetails = this.getUserDetails();
    userDetails.pictureUrl = url
    userDetails.name = name
    this.setUserDetails(JSON.stringify(userDetails))
  }

  setProfilePercentage(percentage){
    let userDetails = this.getUserDetails();
    userDetails['percentage'] = percentage || 0
    this.setUserDetails(JSON.stringify(userDetails))
  }

  getUserDetails(): UserDetail {
    return JSON.parse(localStorage.getItem(StorageKeys.keys.USERDETAIL) || null)
  }

  setSelectedRole(selectedRole) {
    this.localStorageService.set(StorageKeys.keys.SELECTEDROLE, selectedRole);
  }

  getSelectedRole(): string {
    return this.localStorageService.get(StorageKeys.keys.SELECTEDROLE);
  }

  getUserTokenPayload(): TokenPayload {
    const token = this.localStorageService.get(StorageKeys.keys.AUTHTOKEN);
    const tokenPayload: TokenPayload = decode(token);
    return tokenPayload
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['']);
  }

  clearStorage(): void {
    this.localStorageService.remove(StorageKeys.keys.AUTHTOKEN);
    this.localStorageService.remove(StorageKeys.keys.SELECTEDROLE);
    this.localStorageService.remove(StorageKeys.keys.USERDETAIL);
    this.localStorageService.remove(StorageKeys.keys.REFRESHTOKEN);
    this.localStorageService.remove(StorageKeys.keys.LASTVISITED);
    localStorage.clear();
  }

  getBaseRoute() {
    const role = this.getSelectedRole()
    const { baseRoute } = userRoleConfig[role]
    return baseRoute || '404';
  }

  getLandingPageRoute() {
    const role = this.getSelectedRole()
    const { landingPage } = userRoleConfig[role]
    return landingPage || ['404']
  }

  refreshToken() {
    return this.commonHttpService.post(
      'refreshToken', {
      "refreshToken": this.localStorageService.get(StorageKeys.keys.REFRESHTOKEN)
    }).pipe(map((res) => {
      if (res.accessToken) {
        this.localStorageService.set(StorageKeys.keys.AUTHTOKEN, res.accessToken);
        this.localStorageService.set(StorageKeys.keys.REFRESHTOKEN, res.refreshToken);
        return res
      } else {
        this.logout()
      }
    }))
  }

  sendOTP(request) {
    return this.commonHttpService.patch('sendOtp', request)
  }
}
