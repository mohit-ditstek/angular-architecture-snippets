import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';
import { WelcomeComponent } from 'src/app/shared/components/welcome/welcome.component';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { InvestmentRequest } from '../../models/investment';
import { InvestmentService } from '../../services/investment.service';
import { FinancialRequirementsComponent } from './financial-requirements/financial-requirements.component';
import { SectorRequirementsComponent } from './sector-requirements/sector-requirements.component';
import { StageRequirementsComponent } from './stage-requirements/stage-requirements.component';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.scss']
})
export class AddInvestmentComponent implements OnInit {

  formGroupArray: Array<any> = [];
  currencyOptions: Array<any> = [];
  investmentStageOptions: Array<any> = [];
  stageOptions: Array<any> = [];
  companyTypeOptions: Array<any> = [];
  sectorsOptions: Array<any> = [];
  investment: InvestmentRequest;
  loading: boolean = false;
  enableStepperClick: boolean = false;

  @ViewChild(FinancialRequirementsComponent) financialRequirementsComponent: FinancialRequirementsComponent;
  @ViewChild(SectorRequirementsComponent) sectorRequirementsComponent: SectorRequirementsComponent;
  @ViewChild(StageRequirementsComponent) stageRequirementsComponent: StageRequirementsComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    public dialogRef: MatDialogRef<AddInvestmentComponent>,
    public toasterService: ToasterService,
    private investmentService: InvestmentService,
    public commonService: CommonHttpService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.setMetaData()
  }

  ngAfterViewInit(): void {
    this.readChildForms();
    this.cdr.detectChanges();
  }

  async setMetaData() {
    const [
      sectors,
      currencies,
      investmentStages,
      stages,
      companyType,
      investment
    ] = await Promise.all([

      this.commonService.get('sectors').toPromise(),
      this.commonService.get('currency').toPromise(),
      this.commonService.get('investmentStages').toPromise(),
      this.commonService.get('stages').toPromise(),
      this.commonService.get('companyType').toPromise(),
      this.modalData?.investmentDetail ? this.investmentService.fetchInvestmentProfileById(this.modalData?.investmentDetail.id).toPromise() :
        Promise.resolve(undefined)
    ])

    this.sectorsOptions = sectors;
    this.currencyOptions = currencies.map(opt => ({ key: opt.id, value: opt.name }));
    this.investmentStageOptions = investmentStages.map(opt => ({ key: opt.id, value: opt.name }));
    this.stageOptions = stages.map(opt => ({ key: opt.id, value: opt.name }));
    this.companyTypeOptions = companyType.map(opt => ({ key: opt.id, value: opt.type }));
    this.investment = investment;
    this.enableStepperClick = investment.isCongratulationsShown;
  }

  readChildForms() {
    this.formGroupArray = [
      {
        component: this.financialRequirementsComponent,
        componentId: 'FinancialRequirements'
      },
      {
        component: this.sectorRequirementsComponent,
        componentId: 'SectorRequirements'
      },
      {
        component: this.stageRequirementsComponent,
        componentId: 'StageRequirements'
      }
    ]
  }

  async onNext(stepper: MatStepper) {
    const currentComponent = this.formGroupArray[stepper.selectedIndex].component;
    if (currentComponent.formGroup.valid) {
      const saved = await this.saveInfo(stepper)
      if (saved) {
        this.changeMatStepBgColor(stepper.selectedIndex, 'next')
        stepper.next()
        return true
      }
    } else {
      currentComponent.markFormGroupTouched(currentComponent.formGroup)
      currentComponent.focusInvalidFormField(currentComponent.formGroup, this.formGroupArray[stepper.selectedIndex].componentId)
      return false
    }
  }

  async saveInfo(stepper) {
    if (this.formGroupArray[stepper.selectedIndex].component.focusInvalidFormField(this.formGroupArray[stepper.selectedIndex].component.formGroup, this.formGroupArray[stepper.selectedIndex].componentId)) {
      this.formGroupArray[stepper.selectedIndex].component.markFormGroupTouched(this.formGroupArray[stepper.selectedIndex].component.formGroup)
      if (this.loading) { this.loading = false }
      return
    }
    try {
      let investment;
      const currentComponent = this.formGroupArray[stepper.selectedIndex].component;
      if (currentComponent.formGroup.valid) {
        this.loading = true;
        investment = currentComponent.save ? await currentComponent.save() : this.investment
        this.investmentService.updateInvestmentList(true);
      } else currentComponent.markFormGroupTouched(currentComponent.formGroup)
      this.loading = false;
      if (investment) {
        this.investment = investment;
        return investment;
      }
      return false;
    } catch (err) {
      this.loading = false;
      this.toasterService.showError(Utils.getErrorMessage(err), "Error");
      return false
    }
  }

  async onFinish(stepper) {
    this.loading = true;
    const saved = await this.saveInfo(stepper);
    if (saved) {
      this.close();
      if (saved.mandatoryCompletionPercentage == 100 && !saved.isCongratulationsShown) {
        const requestPayload = { "isCongratulationsShown": true };
        this.investmentService.updateInvestmentProfile(saved?.id, requestPayload);
        this.onWelcome();
      }
    }
  }

  onWelcome() {
    this.dialog.open(WelcomeComponent, {
      ...largeModalConfig,
      data: { displayMessage: 'Your profile is set up' }
    })
  }

  onBack(stepper: MatStepper) {
    stepper.previous()
    this.changeMatStepBgColor(stepper.selectedIndex, 'back')
  }

  close() {
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    this.close();
  }

  changeMatStepBgColor(selectedIndex, status) {
    let matStepHeader = document.getElementsByClassName("mat-step-header")[selectedIndex];
    let stepIcon = (matStepHeader.getElementsByClassName("mat-step-icon"));
    if (status === 'next') {
      for (var i = 0; i < stepIcon.length; i++) { stepIcon[i].className += " changeCompletedStepColor" }
    } else {
      for (var i = 0; i < stepIcon.length; i++) { stepIcon[i].className = stepIcon[i].className.replace(" changeCompletedStepColor", "") }
    }
  }
}
