import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Utils } from 'src/app/core/util/utils';

@Component({
  selector: 'app-login-detail',
  templateUrl: './login-detail.component.html',
  styleUrls: ['./login-detail.component.scss']
})
export class LoginDetailComponent implements OnInit {
  loginForm: FormGroup;
  @Output() detailSubmit = new EventEmitter<any>();
  @ViewChild('emailField') emailField: ElementRef


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    this.emailField.nativeElement.focus()
  }

  submitDetail() {
    if (this.loginForm.valid) {
      let controls = this.loginForm.controls;
      let request = {
        email: controls.email.value,
      };

      this.authService.sendOTP(request).subscribe((res) => {
          let data = {
            action: 'details',
            detail: request,
            dynamicEmailExpiryTime : res['emailExpiryTime']
          }
          this.detailSubmit.emit(data);
      }, err => {
        this.toasterService.showError(Utils.getErrorMessage(err),"Error");
      });
    }
  }
}
