/*** Angular core modules ***/
import { Injectable, ViewChild } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Inject } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from '../util/storage-keys';
import { CommonHttpService } from '../services/common-http.service';
import { ToasterService } from '../services/toaster.service';
import { Utils } from '../util/utils';
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  @ViewChild("screen", { static: true }) screen: any;
  errorMessage: any = 0;

  constructor(
    @Inject(DOCUMENT) document,
    private auth: AuthenticationService,
    private router: Router,
    private captureService: NgxCaptureService,
    private localStorageService: LocalStorageService,
    private commonHttpService: CommonHttpService,
    private toasterService: ToasterService
  ) { }

  handleAuthError(req, next, err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 && this.auth.authorizationHeaderValue)  {  
      this.refreshToken(req, next);
    }
    else
      return throwError(err)
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url && this.auth.isAuthenticated()) {
      const idToken = this.auth.authorizationHeaderValue;
      const request: HttpRequest<any> = req.clone({
        setHeaders: {
          Authorization: `Bearer ${idToken}`
        },
      });
      return next
        .handle(request)
        .pipe(map(res => res), catchError((x) => this.handleAuthError(req, next, x)));
    }
    else if (this.auth.isTokenAvaialable()) {
      this.auth.logout();
      this.router.navigate(['login']);
    }
    return next.handle(req).pipe(map(res => res), catchError((x) => this.handleAuthError(req, next, x)));
  }

  refreshToken(req, next) {
    let data = {
      "refreshToken": this.localStorageService.get(StorageKeys.keys.REFRESHTOKEN)
    }
    this.commonHttpService.post('refreshToken', data).subscribe((res) => {
      if (res.accessToken) {
        let idToken = res.accessToken;
        this.localStorageService.set(StorageKeys.keys.AUTHTOKEN, res.accessToken);
        this.localStorageService.set(StorageKeys.keys.REFRESHTOKEN, res.refreshToken);
        let request: HttpRequest<any> = req.clone({
          setHeaders: {
            Authorization: `Bearer ${idToken}`
          },
        });
        return next.handle(request).pipe(catchError((x) => this.handleAuthError(req, next, x)));
      } else {
        this.auth.logout();
        this.router.navigate(['login']);
      }
    }, err => {
      this.toasterService.showError(Utils.getErrorMessage(err),"Error");
    })
  }
}
