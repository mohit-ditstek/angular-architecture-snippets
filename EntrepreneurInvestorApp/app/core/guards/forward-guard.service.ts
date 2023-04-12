import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from '../util/storage-keys';
@Injectable()
export class ForwardGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router, private localStorageService: LocalStorageService) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let selectedRole = this.localStorageService.get(StorageKeys.keys.SELECTEDROLE);
    if (this.auth.isAuthenticated() && this.auth.getUserRoles().includes(selectedRole) && selectedRole.toLocaleLowerCase().includes("role_")) {
      let route = this.auth.getBaseRoute();
      this.router.navigate([route, 'dashboard']);
      return false;
    }
    
    this.auth.clearStorage();
    return true;
  }
}