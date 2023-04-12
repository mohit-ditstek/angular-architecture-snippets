import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { InvestmentComponent } from '../../../add-company/investment/investment.component';

@Component({
  selector: 'app-create-new-opportunity',
  templateUrl: './create-new-opportunity.component.html',
  styleUrls: ['./create-new-opportunity.component.scss']
})
export class CreateNewOpportunityComponent implements OnInit {
  @ViewChild(InvestmentComponent) investmentComponent: InvestmentComponent;
  companyDetail: any;
  currencyOptions: Array<any> = [];
  investmentStageOptions: Array<any> = [];
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public oppoertunityModalData: any,
    public commonService: CommonHttpService,
    private toasterService: ToasterService,
    public dialogRef: MatDialogRef<InvestmentComponent>,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    if (this.oppoertunityModalData) {
      this.companyDetail = this.oppoertunityModalData?.company;
    }
    this.setData();
  }

  async setData() {
    this.isLoading = true;
    try {
      const [
        currencies,
        investmentStages
      ] = await Promise.all([
        this.commonService.get('currency').toPromise(),
        this.commonService.get('investmentStages').toPromise()
      ])
      this.currencyOptions = currencies.map(opt => ({ key: opt.id, value: opt.name })),
        this.investmentStageOptions = investmentStages
      const companyDetailForCreatingIO = { ...this.companyDetail }
      companyDetailForCreatingIO.investmentOpportunities = [];
    } catch (e) {
      this.toasterService.showError(Utils.getErrorMessage(e), 'Error!')
      
    } finally {
    this.isLoading = false;
    }
  }

  async onSave() {
    const currentComponent = this.investmentComponent;
    if (currentComponent.formGroup.valid) {
     await currentComponent.save()
      this.close(true);
    } else {
      currentComponent.focusInvalidFormField(this.investmentComponent.formGroup, 'Investment')
      currentComponent.markFormGroupTouched(currentComponent.formGroup)
    }
  }

  close(refreshOpportunity = false) {
    this.dialogRef.close(refreshOpportunity)
  }

}
