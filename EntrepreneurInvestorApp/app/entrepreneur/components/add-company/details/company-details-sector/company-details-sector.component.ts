import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import {  getCompanyDetailsSectorFormConfig } from './company-details-sector-form-config';

interface Sector {
  id: number,
  name: string,
  visible: boolean
}
@Component({
  selector: 'app-company-details-sector',
  templateUrl: './company-details-sector.component.html',
  styleUrls: ['./company-details-sector.component.scss']
})

export class CompanyDetailsSectorComponent extends TGTForm implements OnInit {
  @Input() sectorsOptions = []
  @Input() company: CompanyRequest
  interestsList: Array<Sector> 
  filteredList: Array<Sector>
  sectors: FormArray
  loading: boolean = true
  otherSectorId: number
  selectedSectors:Array<any> = []; 
  
  constructor(public _formBuilder: FormBuilder, private companyService: CompanyService) {
    super(_formBuilder)
  }
  
  ngOnInit(): void {
      this.interestsList = this.sectorsOptions.map((sector: Sector)=> ({ ...sector, visible: true }))
      const otherSector = this.interestsList?.find(sec => sec.name === 'Other')
      this.otherSectorId = otherSector?.id
      this.filteredList = [...this.interestsList]
      this.selectedSectors = this.interestsList.filter(sector =>  
        this.company.sectors?.find(selectedSector => selectedSector.id === sector.id)).map(this.mapSectorOption)
      this.initialize(getCompanyDetailsSectorFormConfig(this.company, this.interestsList))
      this.sectors = this.formGroup.controls['sectors'] as FormArray
      
      const otherSectorObject = this.company?.sectors?.find(sector => sector.id === this.otherSectorId)
      if(otherSectorObject)
        this.formGroup.controls['otherSectorName'].patchValue(otherSectorObject.name)
      else
        this.formGroup.controls['otherSectorName'].patchValue('')
      this.loading = false    
  }
  mapSectorOption = (sector) => {
    return {
      key: sector.id,
      value: sector.name
    }
  }
  checkBoxSelected(event){
    this.selectedSectors = event
  }
  async save(){
    const sectors = this.selectedSectors.map( sector => ({
      id: sector.key,
      isPrimary: this.formGroup.controls['primarySector'].value === sector.key,
      name : sector.key === this.otherSectorId ? this.formGroup.controls['otherSectorName'].value : sector.name
    }))
    return this.companyService.updateCompany(this.company.id, { sectors })
  }
}

