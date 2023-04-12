import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserDetail } from 'src/app/authentication/models/user-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { TgtDrawerComponent } from 'src/app/ui-component/components/tgt-drawer/tgt-drawer.component';
import { GoalService } from '../../services/goal.service';
import { goalFormConfig } from './addGoal.form.config';


@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent extends TGTForm implements OnInit, OnChanges {
  userDetail: UserDetail;
  minimumDueDate: Date = new Date()
  formGroup:any;
  systemGenerated: boolean = false;
  editFlag:boolean =false
  enablePreviousButton : boolean = false
  enableNextButton : boolean = false
  showPreviousNextButtons:boolean = false
  @Input() entityType:string;
  @Input() entityId:any;
  @Input() goalDetail: any
  @Input() openDrawerFlag:any
  @Input() goalsList: Array<any>=[]
  @Output() onDrawerClose = new EventEmitter<any>();
  @ViewChild(TgtDrawerComponent) public drawer: TgtDrawerComponent;

  constructor(
    public _formBuilder: FormBuilder, 
    private toasterService: ToasterService, 
    private authService: AuthenticationService, 
    private goalService : GoalService
  ) {
    super(_formBuilder)
  }

  ngOnInit(): void {
  }

  ngOnChanges(){
    this.userDetail = this.authService.getUserDetails();
    const goalDetail = this.goalDetail || null
    this.openDrawer(goalDetail)
  }

  openDrawer(goalDetail?: any) {
    this.systemGenerated = false;
    this.initialize(goalFormConfig(goalDetail,this.entityType,this.entityId));
    if(goalDetail){
      this.systemGenerated = goalDetail.systemGenerated
      this.showPrevNextButtons()
    }else{
      this.hidePrevNextButtons()
    } 
    if(this.openDrawerFlag)
      this.drawer.toggle()     
  }

  drawerClosed(event){
    this.onDrawerClose.emit()
  }

  hidePrevNextButtons(){
    this.enablePreviousButton = false
    this.enableNextButton = false
    this.showPreviousNextButtons = false
  }

  showPrevNextButtons(){
      this.showPreviousNextButtons = true
      const currentIndex =  this.goalsList?.findIndex(goal => goal.id === this.goalDetail?.id)
      this.enablePreviousButton = (currentIndex === 0 || this.goalsList?.length === 1)? false : true
      this.enableNextButton = (this.goalsList?.length === 1 || currentIndex === this.goalsList.length-1) ? false : true
  }

  onPrevNextButtonClick(buttonType){
    const currentIndex =  this.goalsList?.findIndex(goal => goal.id === this.goalDetail?.id)
    if(buttonType==="previous"){
      this.goalDetail = this.goalsList[currentIndex-1]
      this.populateNextOrPreviousGoalDetails()
    }else{
      this.goalDetail = this.goalsList[currentIndex+1]
      this.populateNextOrPreviousGoalDetails()
    }
  }

  populateNextOrPreviousGoalDetails(){
    this.systemGenerated = false;
    this.initialize(goalFormConfig(this.goalDetail,this.entityType,this.entityId));
    if(this.goalDetail){
      this.systemGenerated = this.goalDetail.systemGenerated
      this.showPrevNextButtons()
    }else{
      this.hidePrevNextButtons()
    } 
  }

  async onSave() {
    if (this.formGroup.valid) {
      const { creationDate, id, ...goalDetail} = this.formGroup.value
      try{
        await this.updateGoal(id, goalDetail)
        this.drawer.toggle()
        this.drawerClosed(null);
        this.toasterService.showSuccess(`Goal updated successfully`, "Success");
      }catch(err){
        this.toasterService.showError(Utils.getErrorMessage(err),"Error");
      }
    } else {
      this.markFormGroupTouched(this.formGroup)
    }
  }

  async updateGoal(id, goalPayload){
    if(id){
      return this.goalService.updateGoal(id, goalPayload).toPromise()
    }
  }

}
