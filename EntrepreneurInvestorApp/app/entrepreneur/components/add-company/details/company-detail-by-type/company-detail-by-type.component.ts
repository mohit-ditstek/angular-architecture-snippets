import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { Validators, FormBuilder } from '@angular/forms';
import { ShareHolderComponent } from './share-holder/share-holder.component';
import { companyDetailsByTypeFormConfig, companyIncorporatedForm, partnerConfigByCompanyType } from './company-details-form-config';
import { CompanyDetailByType, CompanyPartner, CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { Utils } from 'src/app/core/util/utils';

@Component({
  selector: 'app-company-detail-by-type',
  templateUrl: './company-detail-by-type.component.html',
  styleUrls: ['./company-detail-by-type.component.scss']
})
export class CompanyDetailByTypeComponent extends TGTForm implements OnInit, OnChanges {

  @ViewChild(ShareHolderComponent) partnerForm: ShareHolderComponent

  @Input() companyTypes = []
  @Input() company: CompanyRequest
  @Input() companyType: string
  isLlpNumber: boolean;
  maxDate = new Date();
  partnerFormConfig: any
  maxIncorporationYear = new Date()

  constructor(
    public _formBuilder: FormBuilder,
    private companyService: CompanyService
  ) {
    super(_formBuilder)
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  ngOnChanges() {
    this.initializeForm()
  }

  initializeForm() {
    const formConfig = this.company?.isIncorporated || this.companyType === 'COMPANY' ?
      companyDetailsByTypeFormConfig(this.company, this.companyTypes) :
      companyIncorporatedForm(this.company)
    this.initialize(formConfig)
    this.onCompanyTypeChange(this.company?.companyTypeDetail?.companyType?.id || this.companyTypes[0]?.id)
  }

  onCompanyIncorporatedChange() {
    this.company.isIncorporated = this.formGroup.get('companyIncorporated').value;
    if (this.company.isIncorporated) {
      this.initialize(companyDetailsByTypeFormConfig(this.company, this.companyTypes));
      this.partnerFormConfig = partnerConfigByCompanyType(this.formGroup.controls['companyType'].value)
    }
    else this.initialize(companyIncorporatedForm(this.company))
  }

  onCompanyTypeChange(company) {
    this.partnerFormConfig = partnerConfigByCompanyType(company)
    if (company === 5) {
      this.formGroup?.controls['llpNumber'].setValidators(Validators.compose([Validators.required, Validators.pattern(Utils.llpRegEx), Validators.maxLength(8), Validators.minLength(8)]));
      this.formGroup?.controls['cinNumber'].clearValidators();
      this.formGroup?.controls['cinNumber'].updateValueAndValidity();
      this.isLlpNumber = true;
    } else {
      this.isLlpNumber = false;
      this.formGroup?.controls['cinNumber'].setValidators(Validators.compose([Validators.required, Validators.pattern(Utils.cinRegEx), Validators.maxLength(21), Validators.minLength(21)]));
      this.formGroup?.controls['llpNumber'].clearValidators();
      this.formGroup?.controls['llpNumber'].updateValueAndValidity();
    }
  }

  transformFormToCompanyTypeDetail(formValue): CompanyDetailByType {
    return formValue.companyIncorporated ? {
      cin: formValue.cinNumber,
      llpin: formValue.llpNumber,
      companyType: {
        id: formValue.companyType
      },
      gstNumber: formValue.gstNumber,
      incorporationYear: formValue.yearOfIncorporation,
      partners: this.partnerFormConfig ? this.partnerForm.partners : []
    } : null;
  }

  async save() {
    const { companyIncorporated } = this.formGroup.value
    const companyTypeDetail = this.transformFormToCompanyTypeDetail(this.formGroup.value)
    return this.companyService.updateCompany(this.company.id, { companyTypeDetail, isIncorporated: companyIncorporated })
  }

}
