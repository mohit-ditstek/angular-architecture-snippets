import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { StorageKeys } from 'src/app/core/util/storage-keys';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  step: number = 0;
  detail: any;
  emailExpiryTime: any;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }
  
  submit(userData) {
    switch (userData.action) {
      case "details": {
        this.detail = userData.detail;
        this.emailExpiryTime = userData.dynamicEmailExpiryTime
        this.step = 1;
        break;
      }
      default: {
        this.step = 0;
        break;
      }
    }
  }

}
