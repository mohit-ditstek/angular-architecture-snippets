import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { InvestmentRequest } from 'src/app/investor/models/investment';
import { InvestmentService } from 'src/app/investor/services/investment.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { getInvestmentDetailsSectorFormConfig } from './sector-requirements-form-config';

interface Sector {
  id: number,
  name: string,
  visible: boolean
}

@Component({
  selector: 'app-sector-requirements',
  templateUrl: './sector-requirements.component.html',
  styleUrls: ['./sector-requirements.component.scss']
})
export class SectorRequirementsComponent extends TGTForm implements OnInit, OnChanges {
  @Input() sectorsOptions = []
  @Input() investment: InvestmentRequest;
  interestsList: Array<Sector>
  filteredList: Array<Sector>
  sectors: FormArray
  loading: boolean = true
  selectedSectors: Array<any> = [];
   otherSectorId: number

  constructor(public _formBuilder: FormBuilder, private investmentService: InvestmentService) {
    super(_formBuilder)
  }

  ngOnInit(): void {
    this.initFormConfig();
  }

  ngOnChanges() {
    if (this.sectorsOptions.length > 0) {
      this.initFormConfig();
    }
  }

  initFormConfig() {
    this.interestsList = this.sectorsOptions.map((sector: Sector) => ({ ...sector, visible: true }));
    const otherSector = this.interestsList?.find(sec => sec.name === 'Other')
    this.otherSectorId = (otherSector?.id)
    this.filteredList = [...this.interestsList];
    this.selectedSectors = this.interestsList.filter(sector =>
      this.investment?.sectors?.find(selectedSector => selectedSector.id === sector.id)).map(this.mapSectorOption);
    this.initialize(getInvestmentDetailsSectorFormConfig(this.investment, this.interestsList));
    this.sectors = this.formGroup.controls['sectors'] as FormArray;

    const otherSectorObject = this.investment?.sectors?.find(sector => sector.id === this.otherSectorId)
    if(otherSectorObject)
      this.formGroup.controls['otherSectorName'].patchValue(otherSectorObject.name)
    else
      this.formGroup.controls['otherSectorName'].patchValue('')

    this.loading = false;
  }

  checkBoxSelected(event){
    this.selectedSectors = event
  }

  mapSectorOption = (sector) => {
    return {
      key: sector.id,
      value: sector.name
    }
  }

  async save() {
    const sectors = this.selectedSectors.map(sector => ({
      id: sector.key,
      isPrimary: this.formGroup.controls['primarySector'].value === sector.key,
      name : sector.key === this.otherSectorId ? this.formGroup.controls['otherSectorName'].value : sector.name
    }))
    return this.investmentService.updateInvestmentProfile(this.investment.id, { sectors })
  }


}
