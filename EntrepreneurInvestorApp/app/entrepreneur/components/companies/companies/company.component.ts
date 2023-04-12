import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() stages;
  @Output() comapnyAndIdeaData = new EventEmitter<any>();
  indicativeIj: Array<any>=[]
  constructor(public dialog: MatDialog,
              private router: Router,
              private commonService : CommonHttpService,
              private companyService:CompanyService) {
  }

  ngOnInit(): void {
    this.loadIndicativeIJMilestones()
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

  ngOnChanges() {
  }

  onEditCompanyAndIdea(data) {
    this.comapnyAndIdeaData.emit(data);
  }

  getMilestoneData(milestone) {
    let newMilestones =  milestone?.milestoneListDtos?.map(data =>{
       return {
         hasAchieved : data.isCompleted,
         label : data.name
       }
     })
     if(newMilestones.length)
      return newMilestones
     else
      return this.indicativeIj
   }

   getGrowthStageData(company) {
    let growthStagesMilstone = this.companyService.prepareGrowthStage(company['growthStage'], company['growthStages']);
    return growthStagesMilstone
  }

   goToProfileDashboard(company) {
    if (company['isCompleted'])
      this.router.navigate(['entrepreneur', 'dashboard', company.id])
  }
}
