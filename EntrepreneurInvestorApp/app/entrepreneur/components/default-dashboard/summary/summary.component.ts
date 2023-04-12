import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageRequest } from 'src/app/core/models/page-request';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { AddCompanyFormComponent } from '../../add-company/add-company-form.component';
import { NonDisclosureAgreementComponent } from '../../add-company/non-disclosure-agreement/non-disclosure-agreement.component';
@Component({
  selector: 'app-default-entrepreneur-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  companyList: Array<any> = [];
  pageRequest = new PageRequest()
  constructor(
    private companyService: CompanyService,
    private profileService: ProfileService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.onCompanyModalClose();
    this.companyService.updateCompanytList(true);
  }

  async openDialog(type) {

    let profileDetail = await this.profileService.getProfile();
    if (profileDetail.acceptedNda) {
      this.openCreateCompany(type)
    } else {
      const nonDisclosureDialogRef = this.dialog.open(NonDisclosureAgreementComponent, {
        ...largeModalConfig,
      });
      nonDisclosureDialogRef.afterClosed().subscribe(agree => {
        if (agree) {
          profileDetail["acceptedNda"] = true
          this.profileService.updateProfile(profileDetail);
          this.openCreateCompany(type)
        }
      });
    }
  }

  openCreateCompany(type) {
    const addCompanyDialogRef = this.dialog.open(AddCompanyFormComponent, {
      ...largeModalConfig,
      data: {
        type
      }
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.onCompanyModalClose()
    });
  }

  openEditCompanyDialog(companyDetail) {
    const addCompanyDialogRef = this.dialog.open(AddCompanyFormComponent, {
      ...largeModalConfig,
      data: {
        type: companyDetail.isIncorporated ? 'COMPANY' : 'IDEA',
        companyDetail
      }
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.onCompanyModalClose()
    });
  }

  onCompanyModalClose() {
    this.pageRequest.pageSize = 3;
    this.companyService.getCompaniesAndIdeas(this.pageRequest).subscribe(res => {
      this.companyList = res.data;
    });
  }

  getMilestoneData(milestone) {
    let newMilestones = milestone?.milestoneListDtos?.map(data => {
      return {
        hasAchieved: data.isCompleted,
        label: data.name
      }
    })
    return newMilestones
  }

  getGrowthStageData(company) {
    let growthStagesMilstone = this.companyService.prepareGrowthStage(company['growthStage'], company['growthStages']);
    return growthStagesMilstone
  }

  goToProfileDashboard(company) {
    if (company['isCompleted'])
      this.router.navigate(['entrepreneur', 'dashboard', company.id])
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
