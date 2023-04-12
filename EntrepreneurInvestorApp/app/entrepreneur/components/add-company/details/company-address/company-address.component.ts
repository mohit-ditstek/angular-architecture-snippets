import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { getCompanyAddressFormConfig } from './company-address-form-config';

@Component({
  selector: 'app-company-address',
  templateUrl: './company-address.component.html',
  styleUrls: ['./company-address.component.scss']
})
export class CompanyAddressComponent extends TGTForm implements OnInit {

  @Input() company: CompanyRequest
  @Input() countries: Array<any> = []

  states = []

  constructor(public _formBuilder: FormBuilder, private companyService: CompanyService) {
    super(_formBuilder)
  }

  ngOnInit() {
    const selectedCountry = this.company.companyAddress?.country || this.countries[0].countryCode
    this.initialize(getCompanyAddressFormConfig(this.company, this.countries, selectedCountry));
    this.setStateOptions(selectedCountry)
  }

  setStateOptions(selectedCountry) {
    this.states = (this.countries.find(c => c.countryCode === selectedCountry)?.states || [])
    .map(state => ({ key: state.name, value: state.name}))
  }

  async save(){
    return this.companyService.updateCompany(this.company.id, { companyAddress: this.formGroup.value})
  }

}
