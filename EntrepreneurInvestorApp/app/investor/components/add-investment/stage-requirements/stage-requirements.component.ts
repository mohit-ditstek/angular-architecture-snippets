import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InvestmentRequest } from 'src/app/investor/models/investment';
import { InvestmentService } from 'src/app/investor/services/investment.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { getStageRequirementFormConfig } from './stage-requirements-form-config';

@Component({
  selector: 'app-stage-requirements',
  templateUrl: './stage-requirements.component.html',
  styleUrls: ['./stage-requirements.component.scss']
})
export class StageRequirementsComponent extends TGTForm implements OnInit, OnChanges {

  @Input() investmentStageOptions: Array<any> = [];
  @Input() stageOptions: Array<any> = [];
  @Input() companyTypeOptions: Array<any> = [];
  @Input() investment: InvestmentRequest;

  constructor(public _formBuilder: FormBuilder, private investmentService: InvestmentService) {
    super(_formBuilder);
  }

  ngOnInit() {
    this.initialize(getStageRequirementFormConfig(this.investmentStageOptions, this.stageOptions, this.companyTypeOptions, this.investment));
  }

  ngOnChanges() {
    if (this.investment) {
      this.initialize(getStageRequirementFormConfig(this.investmentStageOptions, this.stageOptions, this.companyTypeOptions, this.investment));
    }
  }

  transformFormToInvestment(form) {
    return {
      investmentStage: {
        id: form.investmentStage
      },
      companyStage: {
        id: form.companyStage
      },
      companyType: {
        id: form.companyType
      },
    }
  }

  async save() {
    const investmentPayload = this.transformFormToInvestment(this.formGroup.value)
    return this.investmentService.updateInvestmentProfile(this.investment.id, investmentPayload);
  }
}
