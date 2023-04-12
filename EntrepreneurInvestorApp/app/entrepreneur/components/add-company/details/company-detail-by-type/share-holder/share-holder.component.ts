import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';

@Component({
  selector: 'app-share-holder',
  templateUrl: './share-holder.component.html',
  styleUrls: ['./share-holder.component.scss']
})
export class ShareHolderComponent extends TGTForm implements OnInit, OnChanges {
  @Input() formConfiguration: any
  @Input() addLinkLabel: string = 'Add'
  @Input() company: CompanyRequest 
  partners: Array<any> = [];
  isUpdatePartner: boolean;
  itemIndexToUpdate: number = 0;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder)
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.initializeForm()
  }

  initializeForm(){
    this.initialize(this.formConfiguration);
    this.partners = [ ...this.company.companyTypeDetail?.partners]
  }

  addUpdatePartner() {
    if (this.formGroup.valid) {
      let partnerData = this.formGroup.value;
      if (!this.isUpdatePartner) {
        this.partners.push(partnerData);
      } else {
        this.partners[this.itemIndexToUpdate] = partnerData;
      }
      this.partners = [...this.partners];
      this.isUpdatePartner = false;
      this.itemIndexToUpdate = 0;
      this.initialize(this.formConfiguration)
    } else {
      this.focusInvalidFormField(this.formGroup,'CompanyDetailByType')
      this.markFormGroupTouched(this.formGroup)
    }
  }

  cancelAndClearPartner() {
    if (this.isUpdatePartner) {
      this.isUpdatePartner = false;
      this.itemIndexToUpdate = 0;
      this.initialize(this.formConfiguration);
    } else {
      this.initialize(this.formConfiguration);
    }
  }


  editPartner(partner) {
    this.formGroup.patchValue({
      name: partner.name,
      email: partner.email,
      sharePercentage: partner.sharePercentage,
      partnerType: partner.partnerType,
      isBoardMember: partner.isBoardMember,
    });

    this.itemIndexToUpdate = this.partners.findIndex(x => x == partner)
    this.isUpdatePartner = true;
  }

  deletePartner(partner) {
    if (confirm("Are you sure you want to delete?")) {
      this.partners = this.partners.filter(x => x != partner);
      this.isUpdatePartner = false;
      this.initialize(this.formConfiguration);
    }
  }


}
