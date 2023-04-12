import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { DetailsComponent } from './details/details.component';
import { CompanyService } from '../../services/company.service';
import { FileService } from 'src/app/shared/services/file.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { FinancialComponent } from './financial/financial.component';
import { InvestmentComponent } from './investment/investment.component';
import { CompanyDocumentsComponent } from './company-documents/company-documents.component';
import { CompanyRequest } from '../../models/company';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { GoToMarketComponent } from './go-to-market/go-to-market.component';
import { SalesComponent } from './sales/sales.component';
import { OperationalMaturityModelComponent } from './operational-maturity-model/operational-maturity-model.component';
import { TeamComponent } from './team/team.component';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { WelcomeComponent } from 'src/app/shared/components/welcome/welcome.component';
import { Utils } from 'src/app/core/util/utils';
interface Stage {
  id: number,
  name: string
}

const DEFAULT_COMPANY: CompanyRequest = {
  logoUrl: '',
  name: '',
  description: '',
  stage: {
    id: 1
  }
}

@Component({
  selector: 'app-add-company-form',
  templateUrl: './add-company-form.component.html',
  styleUrls: ['./add-company-form.component.scss']
})
export class AddCompanyFormComponent implements OnInit {

  @ViewChild(DetailsComponent) detailsComponent: DetailsComponent;
  @ViewChild(TeamComponent) teamComponent: TeamComponent;
  @ViewChild(FinancialComponent) financialComponent: FinancialComponent;
  @ViewChild(InvestmentComponent) investmentComponent: InvestmentComponent;
  @ViewChild(CompanyDocumentsComponent) companyDocumentsComponent: CompanyDocumentsComponent;
  @ViewChild(OperationalMaturityModelComponent) operationalMaturityModelComponent: OperationalMaturityModelComponent;
  @ViewChild(GoToMarketComponent) goToMarketComponent: GoToMarketComponent;
  @ViewChild(SalesComponent) salesComponent: SalesComponent
  @ViewChild('stepper') stepper: MatStepper;

  modalTitle: string = 'Add Company'
  isLoading: boolean = true;
  loading: boolean;
  enableStepperClick: boolean = false;
  sectorsOptions: Array<any> = []
  formGroupArray: Array<any> = []
  stageOptions: Array<any> = []
  companyTypeOptions: Array<any> = []
  countryOptions: Array<any> = []
  employeeStrengthOptions: Array<any> = []
  designationOptions: Array<any> = []
  currencyOptions: Array<any> = []
  investmentStageOptions: Array<any> = []
  documentTypes: Array<any> = []
  operationalStatuses: Array<any> = []
  departments: Array<any> = []
  company: CompanyRequest = DEFAULT_COMPANY
  gtmStageOptions: Array<any> = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: any = {
      type: 'COMPANY',
      companyDetail: {}
    },
    public dialog: MatDialog,
    public companyService: CompanyService,
    public commonService: CommonHttpService,
    public fileService: FileService,
    public toasterService: ToasterService,
    private cdr: ChangeDetectorRef
  ) {

  }

  setModalTitle() {
    if (this.modalData.companyDetail?.id) {
      this.modalTitle = this.modalData.type === 'COMPANY' ? 'Update Company' : 'Update Idea'
    } else {
      this.modalTitle = this.modalData.type === 'COMPANY' ? 'Add Company' : 'Add Idea'
    }
  }

  async ngOnInit() {
    this.setModalTitle()
    await this.setMetaData()
  }

  ngAfterViewInit(): void {
    this.readChildComponentForms();
    this.cdr.detectChanges();
  }

  async setMetaData() {
    try {
      this.isLoading = true

      const [
        sectors,
        stages,
        companyTypes,
        countries,
        employeeStrengths,
        designations,
        currencies,
        investmentStages,
        documentTypes,
        operationalStatuses,
        departments,
        gtmStages,
        company = DEFAULT_COMPANY,
      ] = await Promise.all([
        this.companyService.getCompanySectorList().toPromise(),
        this.companyService.getCompanyStages().toPromise(),
        this.companyService.getCompanyTypes().toPromise(),
        this.commonService.get('country').toPromise(),
        this.commonService.get('employeeSize').toPromise(),
        this.commonService.get('execDesignation').toPromise(),
        this.commonService.get('currency').toPromise(),
        this.commonService.get('investmentStages').toPromise(),
        this.commonService.get('documentType/COMPANY').toPromise(),
        this.commonService.get('operationalStatus').toPromise(),
        this.commonService.get('department').toPromise(),
        this.commonService.get('gtmStage').toPromise(),
        this.modalData?.companyDetail ?
          this.companyService.fetchCompanyById(this.modalData?.companyDetail.id).toPromise() :
          Promise.resolve(undefined),
      ])

      this.stageOptions = stages ? stages.map((stage: Stage) => ({ key: stage.id, value: stage.name })) : []
      this.sectorsOptions = sectors
      this.company = company
      this.enableStepperClick = company.isCongratulationsShown;
      this.companyTypeOptions = companyTypes
      this.countryOptions = countries
      this.employeeStrengthOptions = employeeStrengths.map(option => ({ key: option.value, value: option.value }))
      this.designationOptions = designations
      this.currencyOptions = currencies.map(opt => ({ key: opt.id, value: opt.name })),
        this.investmentStageOptions = investmentStages
      this.documentTypes = documentTypes
      this.operationalStatuses = operationalStatuses
      this.departments = departments
      this.gtmStageOptions = gtmStages.map(option => ({ key: option.name, value: option.name }))
    } finally {
      this.isLoading = false;
    }
  }

  readChildComponentForms() {
    this.formGroupArray = [
      {
        forms: []
      },
      {
        component: this.teamComponent
      },
      {
        component: this.financialComponent
      },
      {
        component: this.investmentComponent,
        componentId: 'Investment'
      },
      {
        component: this.companyDocumentsComponent,
      },
      {
        component: this.operationalMaturityModelComponent
      },
      {
        component: this.goToMarketComponent
      },
      {
        component: this.salesComponent
      },
    ]
  }


  async onNext(stepper: MatStepper) {
    if (stepper.selectedIndex == 0) {
      if (this.detailsComponent.isCurrentFormValid()) {
        const saved = await this.saveInfo(stepper)
        if (saved && this.detailsComponent.next()) {
          this.changeMatStepBgColor(stepper.selectedIndex, 'next')
          stepper.next()
          return saved
        }
      }
    } else {
      const currentComponent = this.formGroupArray[stepper.selectedIndex].component;
      currentComponent.markFormGroupTouched(currentComponent.formGroup)
      if (currentComponent.formGroup.valid) {
        const saved = await this.saveInfo(stepper)
        if (saved) {
          this.changeMatStepBgColor(stepper.selectedIndex, 'next')
          stepper.next()
          return true
        }
      } else {
        currentComponent.focusInvalidFormField(currentComponent.formGroup, this.formGroupArray[stepper.selectedIndex].componentId)
      }
    }
    return false
  }


  onBack(stepper: MatStepper) {
    if (stepper.selectedIndex === 0) {
      this.detailsComponent.previous()
    } else {
      stepper.previous()
      this.changeMatStepBgColor(stepper.selectedIndex, 'back')
    }
  }

  async saveInfo(stepper) {
    try {
      let company
      if (stepper.selectedIndex == 0) {
        if (this.detailsComponent.isCurrentFormValid()) {
          this.loading = true;
          company = await this.detailsComponent.save()
          this.companyService.updateCompanytList(true);
        }
      } else {
        const currentComponent = this.formGroupArray[stepper.selectedIndex].component;
        if (currentComponent.formGroup.valid) {
          this.loading = true;
          company = currentComponent.save ? await currentComponent.save() : this.company
          this.companyService.updateCompanytList(true);
        } else {
          currentComponent.focusInvalidFormField(this.formGroupArray[stepper.selectedIndex].component.formGroup, this.formGroupArray[stepper.selectedIndex].componentId)
          currentComponent.markFormGroupTouched(currentComponent.formGroup)
        }
      }

      this.loading = false;
      if (company) {
        this.company = company
        return company
      }
      return false
    } catch (err) {
      this.loading = false;
      this.toasterService.showError(Utils.getErrorMessage(err), "Error");
      return false
    }
  }

  async onFinish() {
    const savedSuccess = await this.onNext(this.stepper)
    if (savedSuccess) {
      this.dialog.closeAll();
      if (!savedSuccess.isCongratulationsShown) {
        const requestPayload = { "isCongratulationsShown": true };
        this.companyService.updateCompany(savedSuccess?.id, requestPayload);
        this.onWelcome();
      }
    }
  }

  onWelcome() {
    this.dialog.open(WelcomeComponent, {
      ...largeModalConfig,
      data: { displayMessage: 'Your company has been setup!!' }
    })
  }

  close() {
    this.dialog.closeAll();
  }

  changeMatStepBgColor(selectedIndex, status) {
    let matStepHeader = document.getElementsByClassName("mat-step-header")[selectedIndex]
    let stepIcon = (matStepHeader.getElementsByClassName("mat-step-icon"))
    if (status === 'next') {
      for (var i = 0; i < stepIcon.length; i++) { stepIcon[i].className += " changeCompletedStepColor" }
    } else {
      for (var i = 0; i < stepIcon.length; i++) { stepIcon[i].className = stepIcon[i].className.replace(" changeCompletedStepColor", "") }
    }
  }


}
