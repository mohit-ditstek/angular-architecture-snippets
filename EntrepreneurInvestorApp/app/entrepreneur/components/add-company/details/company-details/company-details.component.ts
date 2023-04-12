import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { FileService } from 'src/app/shared/services/file.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { environment } from 'src/environments/environment.prod';
import { getCompanyDetailsFormConfig } from './company-basic-detail-form-config';

interface Stage {
  id: number,
  name: string
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent extends TGTForm implements OnInit {

  @Input() stages = [];
  @Input() company: CompanyRequest
  showCropper = false;

  constructor(
    public _formBuilder: FormBuilder,
    private companyService: CompanyService,
    private fileService: FileService
  ) {
    super(_formBuilder)
  }

  ngOnInit(): void {
    this.initialize(getCompanyDetailsFormConfig(this.company, this.stages))
  }

  get logoImageUrl() {
    return this.formGroup.controls['logoUrl'].value && this.formGroup.controls['logoUrl'].value != "imageAvailable" ? this.formGroup.controls['logoUrl'].value : '../assets/images/companyDefaultImage.png'
  }

  onCropperLoad() {
    this.showCropper = true;
  }

  onCropperClose() {
    this.showCropper = false;
  }

  logoImage: any;
  onLogoChange(logoImage) {
    this.logoImage = logoImage;
    this.formGroup.controls['logoUrl'].setValue("imageAvailable")
    this.onCropperClose()
  }

  transformFormToCompany(form): CompanyRequest {
    return {
      name: form.name,
      description: form.description,
      logoKey: form.logoKey,
      stage: {
        id: form.stage
      }
    }
  }

  async saveImage() {
    const formData = new FormData();
    formData.append('files', this.logoImage)
    const logoKey = await this.fileService.uploadFile(formData).toPromise().then(this.getResourceKey)
    this.formGroup.get('logoKey').setValue(logoKey)
    this.logoImage = null;
  }

  async save() {
    if (this.logoImage)
      await this.saveImage()
    const companyPayload = this.transformFormToCompany(this.formGroup.value)
    return this.company.id ? 
      this.companyService.updateCompany(this.company.id, companyPayload) : 
      this.companyService.createCompany(companyPayload).toPromise()
  }

  getResourceKey(response) {
    return response[0].s3Key
  }
}

