import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PageRequest } from 'src/app/core/models/page-request';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';
import { CommonService } from 'src/app/shared/services/common.service';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { InvestmentOpportunityJourney } from '../../models/investment-opportunities';
import { Mentor } from '../../models/mentors';
import { CompanyService } from '../../services/company.service';
import { EnterprenuerService } from '../../services/enterprenuer.service';
import { AddCompanyFormComponent } from '../add-company/add-company-form.component';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent implements OnInit {
  companyDetail;
  recommendedInvestors: Array<any> = [];
  recommendedMentors: Array<Mentor>;
  investmentOpportunityJourney: Array<InvestmentOpportunityJourney>;
  entityType: string = 'COMPANY';
  companyId: any;
  pageRequest = new PageRequest();
  investmentJourneyDetail;
  investmentJourneyMilstone: Array<any> = [];
  isLoading: boolean = false;
  growthStageMilestone: Array<any> = [];
  widgets: Array<any> = [];
  stages: Array<any> = [];
  indicativeIJ: Array<any> = []

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute,
    private entrepreneurService: EnterprenuerService,
    public dialog: MatDialog,
    public commonHttpService: CommonHttpService,
    private toasterService: ToasterService,
    private commonService:CommonService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = params['id']
      this.setData();
    });
  }

  setData() {
    this.isLoading = true;
    let fetchCompanyById = this.companyService.fetchCompanyById(this.companyId)
    let stages = this.commonHttpService.get('stages')
    let getInvestmentJourneyForCompany = this.companyService.getInvestmentJourneyForCompany(this.companyId)
    let getWidgetData = this.companyService.getWidgetData(this.companyId)
    let getIndicativeIj = this.commonService.getIndicativeIJ()
    forkJoin([
      fetchCompanyById,
      stages,
      getInvestmentJourneyForCompany,
      getWidgetData,
      getIndicativeIj
    ]).subscribe(([
      companyDetail,
      stages,
      investmentJourneyDetail,
      widgetData,
      indicativeIj
    ]) => {
      this.companyDetail = companyDetail;
      this.commonService.updateSideNav(Utils.updateSideNav(`/entrepreneur/dashboard/${this.companyDetail.id}`,true,this.companyDetail.name,companyDetail?.logoUrl || '../assets/images/companyDefaultImage.png'));
      this.stages = stages;
      this.investmentJourneyDetail = investmentJourneyDetail;
      this.prepareInvestmentJourney(this.investmentJourneyDetail, indicativeIj);
      this.indicativeIJ = this.prepareIndicativeIj(indicativeIj)
      this.prepareWidgets(widgetData);
      this.isLoading = false;
    }, err => {
      this.toasterService.showError(Utils.getErrorMessage(err), "Error");
      this.isLoading = false;
    });

    this.recommendedMentors = this.entrepreneurService.getRecommendedMentors();
    this.companyService.updateCompanytList(true);
  }


  openEditModal(companyDetail) {
    const type = companyDetail.isIncorporated ? 'COMPANY' : 'IDEA'
    this.openCompanyDialog(type, companyDetail)
  }

  openCompanyDialog(type, companyDetail) {
    const addCompanyDialogRef = this.dialog.open(AddCompanyFormComponent, {
      ...largeModalConfig,
      data: {
        type: type,
        companyDetail
      }
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.setData();
    });
  }

  prepareInvestmentJourney(data, indicativeIJ) {
    this.investmentJourneyMilstone = data?.milestones?.map(milstone => {
      return {
        name: milstone.name,
        isCompleted: milstone.isCompleted,
        ...(!milstone.isCompleted) && { userName: data.userName },
        ...(!milstone.isCompleted) && { userImage: data?.profilePicture || '../assets/images/default-avatar.jpeg' },
      }
    }) 
  }

  prepareIndicativeIj(indicativeIJ) {
   return indicativeIJ.map( milestone =>({
      name: milestone.name,
      isCompleted: milestone.isCompleted,
  }));
  }

  getGrowthStageData() {
    if (this.companyDetail?.stage) {
      let currentStage = this.companyDetail?.stage?.name;
      let growthStageMilestone = this.companyService.prepareGrowthStage(currentStage, this.stages);
      return growthStageMilestone;
    }

  }

  prepareWidgets(widgetsDetail) {
    this.widgets = [
      this.prepareWidgetData("Funding Stage",
        widgetsDetail?.fundingStage?.name,
        "",
        widgetsDetail?.fundingStage?.percentage,
        widgetsDetail?.fundingStage?.lastStageName),
      this.prepareWidgetData("Product Stage", widgetsDetail?.productStage),
      this.prepareWidgetData("Competition", widgetsDetail?.competition),
      this.prepareWidgetData("Customers", widgetsDetail?.customer),
      this.prepareWidgetData("Insights", "SWOT | Maturity Model")
    ]
  }

  prepareWidgetData(name, value = '-', label = "", percentage = "", type = "") {
    return {
      name,
      value,
      lable: label,
      percentage,
      type
    }
  }

}
