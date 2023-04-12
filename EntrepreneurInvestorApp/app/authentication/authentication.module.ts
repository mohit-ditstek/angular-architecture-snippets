import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { UiComponentModule } from '../ui-component/ui-component.module';
import { ChooseRoleComponent } from './components/signup/choose-role/choose-role.component';
import { SignupDetailComponent } from './components/signup/signup-detail/signup-detail.component';
import { OtpVerificationComponent } from './components/signup/otp-verification/otp-verification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './components/signup/welcome/welcome.component';
import { CoreModule } from '../core/core.module';
import { LoginComponent } from './components/login/login.component';
import { LoginDetailComponent } from './components/login/login-detail/login-detail.component';
import { LoginVerificationComponent } from './components/login/login-verification/login-verification.component';
import { MobileNotVerfiedComponent } from './components/signup/mobile-not-verfied/mobile-not-verfied.component';
@NgModule({
  declarations: [
    SignupComponent,
    ChooseRoleComponent,
    SignupDetailComponent,
    OtpVerificationComponent,
    WelcomeComponent,
    LoginComponent,
    LoginDetailComponent,
    OtpVerificationComponent,
    LoginVerificationComponent,
    MobileNotVerfiedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    UiComponentModule,
    CoreModule,
  ]
})
export class AuthenticationModule { }