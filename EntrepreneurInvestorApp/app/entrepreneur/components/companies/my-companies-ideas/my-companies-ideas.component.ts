import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { UserDetail } from 'src/app/authentication/models/user-model';
import { PageRequest } from 'src/app/core/models/page-request';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { largeModalConfig } from 'src/app/ui-component/components/tgt-modal/config';
import { AddCompanyFormComponent } from '../../add-company/add-company-form.component';
import { NonDisclosureAgreementComponent } from '../../add-company/non-disclosure-agreement/non-disclosure-agreement.component';

@Component({
  selector: 'app-my-companies-ideas',
  templateUrl: './my-companies-ideas.component.html',
  styleUrls: ['./my-companies-ideas.component.scss']
})
export class MyCompaniesIdeasComponent implements OnInit {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allRecords: Array<any> = [];
  filteredList: Array<any> = [];
  isloading: boolean = true;
  stages: Array<any> = [];
  companyList: Array<any> = [];
  pageRequest = new PageRequest();
  userDetail: UserDetail;
  entityType: string = 'PROFILE';
  profileId: any;
  totalCount: number = 0;


  constructor(private companyService: CompanyService,
    private profileService: ProfileService,
    public dialog: MatDialog, private authService: AuthenticationService,) { }

  ngOnInit() {
    this.getCompaniesAndIdeasList();
    this.userDetail = this.authService.getUserDetails();
    this.profileId = this.userDetail['profileId'];
    this.companyService.updateCompanytList(true);
  }

  ngAfterViewInit(){
    this.paginator?.page.subscribe(() => this.getCompaniesAndIdeasList())
  }

  onChange(){
    this.getCompaniesAndIdeasList()
  }

  getCompaniesAndIdeasList() {
    this.pageRequest.pageNumber =  this.paginator?.pageIndex + 1 || 1,
    this.pageRequest.pageSize =  this.paginator?.pageSize || 25;
    this.companyService.getCompaniesAndIdeas(this.pageRequest).subscribe(res => {
      this.allRecords = res.data;
      this.totalCount = res.count;
      this.filteredList = this.allRecords;
    })

    this.companyService.getCompanyStages().subscribe(res => {
      this.stages = res;
    })
  }

  tabSelected(event) {
    this.filteredList = this.allRecords.filter(el => {
      if (event.index === 0) {
        return el
      } else {
        return (event.index === 1 && el.isIncorporated === true) || (event.index === 2 && el.isIncorporated === false)
      }
    })
  }

  async openDialog(type) {
    let profileDetail = await this.profileService.getProfile();
    if (profileDetail.acceptedNda) {
      this.openCompanyDialog(type)
    } else {
      const nonDisclosureDialogRef = this.dialog.open(NonDisclosureAgreementComponent, {
        ...largeModalConfig,
      });
      nonDisclosureDialogRef.afterClosed().subscribe(agree => {
        if (agree) {
          profileDetail["acceptedNda"] = true
          this.profileService.updateProfile(profileDetail);
          this.openCompanyDialog(type)
        }
      });
    }
  }

  openEditModal(companyDetail) {
    const type = companyDetail.isIncorporated ? 'COMPANY' : 'IDEA'
    this.openCompanyDialog(type, companyDetail)
  }


  openCompanyDialog(type, companyDetail = null) {
    const addCompanyDialogRef = this.dialog.open(AddCompanyFormComponent, {
      ...largeModalConfig,
      data: {
        type: type,
        companyDetail
      }
    });
    addCompanyDialogRef.afterClosed().subscribe(result => {
      this.getCompaniesAndIdeasList()
      this.companyService.updateCompanytList(true);
    });
  }
}
