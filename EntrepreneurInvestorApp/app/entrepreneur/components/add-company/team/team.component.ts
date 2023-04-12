import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { ExecutiveComponent } from './executive/executive.component';
import { getTeamFormConfig } from './team.form.config';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends TGTForm implements OnInit, OnChanges{

  @Input() company: CompanyRequest
  @Input() designationOptions: Array<any> = []
  @ViewChild(ExecutiveComponent) executiveForm: ExecutiveComponent
  executives: Array<any> = []

  constructor(
    public _formBuilder: FormBuilder, 
    private companyService: CompanyService
  ) {
    super(_formBuilder)
  }

  ngOnInit() {}

  ngOnChanges() {
    this.initialize(getTeamFormConfig(this.company))
    this.executives = this.company?.executives?.map(exec => {
        return {
          ...exec
        }
    }) || []
    this.markFormGroupUntouched(this.formGroup)
    
  }

  async save() {
    const { employeeStrength } = this.formGroup.value
    const executives = this.executiveForm.executives.length ?  
        this.executiveForm.executives.map(exec => ({
          ...exec
        })) : 
        []
    return this.companyService.updateCompany(this.company.id, {employeeStrength, executives})
  }
}
