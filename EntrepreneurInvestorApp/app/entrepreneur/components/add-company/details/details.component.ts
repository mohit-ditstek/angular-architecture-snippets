import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyAddressComponent } from './company-address/company-address.component';
import { CompanyDetailByTypeComponent } from './company-detail-by-type/company-detail-by-type.component';
import { CompanyDetailsSectorComponent } from './company-details-sector/company-details-sector.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() sectorsOptions = []
  @Input() stageOptions = []
  @Input() companyTypeOptions = []
  @Input() countryOptions = []
  @Input() company: CompanyRequest
  @Input() companyType: string = 'COMPANY'
  @ViewChild(CompanyDetailsComponent) companyDetailsComponent: CompanyDetailsComponent;
  @ViewChild(CompanyDetailsSectorComponent) companyDetailsSectorComponent: CompanyDetailsSectorComponent;
  @ViewChild(CompanyDetailByTypeComponent) companyDetailByTypeComponent: CompanyDetailByTypeComponent;
  @ViewChild(CompanyAddressComponent) companyAddressComponent: CompanyAddressComponent;
  @ViewChild('detailsStepper') stepper: MatStepper;

  step: number = 0
  steps = []
  
  
  constructor() { }
  ngOnInit() {}

  ngAfterViewInit() {
    this.steps = [
       {
        name: 'BASIC_DETAILS',
        component: this.companyDetailsComponent,
        form: this.companyDetailsComponent.formGroup,
        componentId : 'CompanyDetails'
      },
      {
        name: 'SECTORS',
        component: this.companyDetailsSectorComponent,
        form: this.companyDetailsSectorComponent.formGroup,
        componentId : 'CompanyDetailSectors'
      },
      {
        name: 'TYPE',
        component: this.companyDetailByTypeComponent,
        form: this.companyDetailByTypeComponent.formGroup,
        componentId : 'CompanyDetailByType'
      },
      {
        name: 'ADDRESS',
        component: this.companyAddressComponent,
        form: this.companyAddressComponent.formGroup,
        componentId : 'CompanyAdress'
      }
    ]
  }

  isCurrentFormValid(){
    const currentForm = this.steps[this.step].component.formGroup
    const componentId = this.steps[this.step].componentId
    this.steps[this.step].component.markFormGroupTouched(currentForm)
    this.steps[this.step].component.focusInvalidFormField(currentForm,componentId)
    return currentForm.valid
  }


  next(){
    if(
      this.step < this.steps.length - 1 &&
      !(this.steps[this.step + 1] === 'ADDRESS' && !this.company.isIncorporated)
    ){
      this.step += 1
      this.stepper.next()
      return false
    }else{
      return true 
    }
  }

  previous(){
    if(this.step > 0){
      this.stepper.previous()
      this.step -= 1
    }
  }

  async save() {
    return this.steps[this.step].component.save()
  }

}