import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/authentication/services/user.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';

@Component({
  selector: 'app-signup-detail',
  templateUrl: './signup-detail.component.html',
  styleUrls: ['./signup-detail.component.scss'],
  providers: [DatePipe]
})
export class SignupDetailComponent implements OnInit {
  signupForm: FormGroup;
  minimumAge = new Date()

  @Input() selectedRoleData;
  @Output() detailSubmit = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private userService: UserService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?) |0)?[0-9]{10}$")]],
      dateOfBirth: ['', [Validators.required]]
    });
  }

  onDateChange(event) {
    let minimumDate = new Date()
    let validDate = minimumDate.setFullYear(minimumDate.getFullYear() - 15);
    if (validDate <= event.value) {
      this.signupForm.controls['dateOfBirth'].setErrors({ noValidDate: true })
    } else {
      let selectedDate = this.datePipe.transform(event.value, "yyyy-MM-dd");
      this.signupForm.controls['dateOfBirth'].setValue(selectedDate);
    }
  }

  submitDetail() {
    if (this.signupForm.valid) {
      const controls = this.signupForm.controls;
      const user = {
        roles: Array(this.selectedRoleData.key),
        name: controls.name.value,
        email: controls.email.value,
        countryCode: "91",
        mobile: controls.mobile.value,
        dateOfBirth: controls.dateOfBirth.value
      }
      this.userService.createUser(user).subscribe((res) => {
          this.detailSubmit.emit({
            action: 'details',
            user,
            dynamicExpiryTime : res.otpExpiryTimeDto
          });
      }, err => {
        this.toasterService.showError(Utils.getErrorMessage(err),"Error");
      })
    }
  }

  checkMobile(event: any) {
    Utils.allowNumber(event);
  }
}
