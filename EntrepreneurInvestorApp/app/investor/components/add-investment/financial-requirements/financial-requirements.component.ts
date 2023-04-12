import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InvestmentRequest } from 'src/app/investor/models/investment';
import { InvestmentService } from 'src/app/investor/services/investment.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { getFinancialRequirementFormConfig } from './financial-requirements-form-config';

@Component({
  selector: 'app-financial-requirements',
  templateUrl: './financial-requirements.component.html',
  styleUrls: ['./financial-requirements.component.scss']
})
export class FinancialRequirementsComponent extends TGTForm implements OnInit, OnChanges {

  @Input() currencyOptions: Array<any> = [];
  @Input() investment: InvestmentRequest;
  minDate = new Date();
  constructor(public _formBuilder: FormBuilder, private investmentService: InvestmentService) {
    super(_formBuilder)
  }

  ngOnInit() {
     this.formGroup.get('exitPeriod').setValidators([Validators.required]);
    this.initialize(getFinancialRequirementFormConfig(this.currencyOptions, this.investment?.financialRequirement))
  }

  ngOnChanges() {
    this.initialize(getFinancialRequirementFormConfig(this.currencyOptions, this.investment?.financialRequirement));
    this.formGroup.get('exitPeriod').setValidators([Validators.required])
  }

  transformFormToInvestment(form) {
    return {
      financialRequirement: {
        name: form.name,
        amountToInvest: form.amountToInvested.amountToInvestedInput,
        currency: {
          id: form.amountToInvested.amountToInvestedDropDown,
        },
        exitPeriod: form.exitPeriod,
        investorType: form.investorType,
        roi: form.roi
      }
    }
  }

  async save() {
    const investmentPayload = this.transformFormToInvestment(this.formGroup.value)
    return this.investment?.id ? this.investmentService.updateInvestmentProfile(this.investment.id, investmentPayload) :
      this.investmentService.createInvestmentProfile(investmentPayload).toPromise()
  }

}
