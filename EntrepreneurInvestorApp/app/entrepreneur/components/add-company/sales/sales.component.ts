import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyRequest, SalesDetail } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { FileService } from 'src/app/shared/services/file.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { environment } from 'src/environments/environment';
import { getFormConfig } from './sales.form.config';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent extends TGTForm implements OnInit, OnChanges {

  @Input() currencyOptions: Array<any> = []
  @Input() company: CompanyRequest

  constructor(
    public _formBuilder: FormBuilder,
    private fileService: FileService,
    private companyService: CompanyService
  ) {
    super(_formBuilder)
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.initialize(getFormConfig(this.company, this.currencyOptions))
  }

  onChange(){}

  getResourceKey(response) {
    return response[0].s3Key
  }

  async uploadSalesPlan(file){
    const formData = new FormData();
    formData.append('files', file)
    return this.fileService.uploadFile(formData).toPromise().then(this.getResourceKey)
  }

  async save() {
    const controls = this.formGroup.controls
    const salesAchieved = controls['salesAchieved'] as FormGroup
    const salesTarget = controls['salesTarget'] as FormGroup
    const salesDetail = {} as SalesDetail
    if(this.formGroup.controls['salesPlan'].value){
      const salesPlanReport = this.formGroup.controls['salesPlanReport'].value
      if(salesPlanReport && typeof salesPlanReport !== 'string') {
        salesDetail.salesPlanReport = await this.uploadSalesPlan(salesPlanReport)
      }
    }

    salesDetail.currentSales = salesAchieved.controls['salesAchievedInput'].value
    salesDetail.currentSalesCurrency= { id: salesAchieved.controls['salesAchievedDropDown'].value }
    salesDetail.employees = controls['salesEmployees'].value
    salesDetail.salesTarget = salesTarget.controls['salesTargetInput'].value
    salesDetail.salesTargetCurrency = { id: salesTarget.controls['salesTargetDropDown'].value }
    return this.companyService.updateCompany(this.company.id, {salesDetail})
  }

}
