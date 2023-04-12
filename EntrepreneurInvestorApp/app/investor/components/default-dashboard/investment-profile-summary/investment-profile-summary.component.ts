import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddInvestmentComponent } from '../../add-investment/add-investment.component';
import { InvestmentService } from 'src/app/investor/services/investment.service';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { Router } from '@angular/router';
import { PageRequest } from 'src/app/core/models/page-request';
import { CommonHttpService } from 'src/app/core/services/common-http.service';

@Component({
  selector: 'app-investment-profile-summary',
  templateUrl: './investment-profile-summary.component.html',
  styleUrls: ['./investment-profile-summary.component.scss']
})
export class InvestmentProfileSummaryComponent implements OnInit {
  investmentProfilesList: Array<any> = []
  investmentsMadeList: Array<any> = []
  pageRequest = new PageRequest();
  indicativeIj: Array<any>=[]
  constructor(private investmentService: InvestmentService, 
    private router: Router,
    private commonService : CommonHttpService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.loadIndicativeIJMilestones()
    this.loadInvestmentProfiles()
  }

  loadIndicativeIJMilestones(){
    this.commonService.get("indicativeIJ").subscribe(res => {
      this.indicativeIj = res ? res.map(data => {return {
          ...data,
          label : data.name
        } 
      }) : []
    })
  }

  loadInvestmentProfiles() {
    this.pageRequest.pageNumber = 1
    this.pageRequest.pageSize  = 3
    this.investmentService.getInvestmentProfile(this.pageRequest).subscribe(res => {
      this.investmentProfilesList = res['data'] || [];
      this.investmentService.updateInvestmentList(true);
    });
  }

  getMilestoneData(milestone) {
    let newMilestones =  milestone?.milestoneListDtos?.map(data =>{
       return {
         hasAchieved : data.isCompleted,
         label : data.name
       }
     })
     return newMilestones
   }
   getCurrentStage(investment, latestCompletedMilestoneId){
     const milestonesLength = investment?.milestoneListDtos?.length
     const latestdMilestoneIndex = investment?.milestoneListDtos?.findIndex(milestone => milestone.id === latestCompletedMilestoneId)
     let isLatestMilestoneCompleted = investment?.milestoneListDtos?.[latestdMilestoneIndex].isCompleted
     const latestCompletedMilestoneIndex = isLatestMilestoneCompleted ? (latestdMilestoneIndex + 1) : latestdMilestoneIndex
     const currentStageIndex = (milestonesLength === latestdMilestoneIndex) ? milestonesLength : (latestCompletedMilestoneIndex)
     return investment?.milestoneListDtos?.[currentStageIndex]?.name
   }

  openAddInvestmentDialog() {
    const addCompanyDialogRef = this.dialog.open(AddInvestmentComponent, {
      ...largeModalConfig,
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.loadInvestmentProfiles();
    });
  }

  openInvestmentEditDialog(investmentDetail) {
    const addCompanyDialogRef = this.dialog.open(AddInvestmentComponent, {
      ...largeModalConfig,
      data: {
        investmentDetail
      }
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.loadInvestmentProfiles();
    });
  }

  goToInvestmentProfileDashbored(id) {
    this.router.navigate(['investor', 'dashboard',id])
  }
}
