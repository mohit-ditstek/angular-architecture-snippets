import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { executiveFormConfig } from '../team.form.config';

@Component({
  selector: 'app-executive',
  templateUrl: './executive.component.html',
  styleUrls: ['./executive.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ExecutiveComponent extends TGTForm implements OnInit, OnChanges {

  @Input() company: CompanyRequest
  @Input() designations = [];
  @Input() executives: Array<any> = [];

  isUpdateExecutive: boolean = false;
  itemIndexToUpdate: number = 0;
  isLoading: boolean = false;
  maxAssociationYear = new Date()

  constructor(public _formBuilder: FormBuilder,private cdr: ChangeDetectorRef) {
    super(_formBuilder);
  }

  ngOnInit() { }

  ngOnChanges() {
    this.initialize(executiveFormConfig(this.designations));
    this.markFormGroupUntouched(this.formGroup)
  }

  addUpdateExecutive() {
    if (this.formGroup.valid) {
      let executiveData = this.formGroup.value;
      if (!this.isUpdateExecutive) {
        this.executives.push(executiveData);
      } else {
        this.executives[this.itemIndexToUpdate] = executiveData;
      }
      this.executives = [...this.executives];
      this.isUpdateExecutive = false;
      this.itemIndexToUpdate = 0;
      this.initialize(executiveFormConfig(this.designations));
    } else {
      this.focusInvalidFormField(this.formGroup,'Executive')
      this.markFormGroupTouched(this.formGroup)
    }
  }

  editExecutive(executive) {
    this.isLoading = true;
    this.formGroup.patchValue({
      name: executive.name,
      email: executive.email,
      associationYear: executive.associationYear,
      designation: executive.designation,
    });

    this.itemIndexToUpdate = this.executives.findIndex(x => x == executive)
    this.isUpdateExecutive = true;
    this.cdr.detectChanges();
    this.isLoading = false;
  }

  deleteExecutive(executive) {
    if (confirm("Are you sure you want to delete?")) {
      this.executives = this.executives.filter(x => x != executive);
      this.isUpdateExecutive = false;
      this.initialize(executiveFormConfig(this.designations));
    }
  }

  cancelUpdateExecutive() {
    this.isUpdateExecutive = false;
    this.itemIndexToUpdate = 0;
    this.initialize(executiveFormConfig(this.designations));
  }



}
