import { FormArray, FormControl, Validators } from "@angular/forms";
import { CompanyRequest } from "src/app/entrepreneur/models/company";

export const getCompanyDetailsSectorFormConfig = (company: CompanyRequest, sectorList) => {
  let primarySector = null
  const controlArray = sectorList.map(sector => {
   const selectedSector = company.sectors?.find(selectedSector => selectedSector.id === sector.id) 
   if(selectedSector?.isPrimary)
    primarySector = selectedSector.id
   return new FormControl(selectedSector)
  });
  return {
    sectors: {
      controlsArray: new FormArray(controlArray)
    },
    primarySector: {
      validators: [primarySector, [Validators.required]],
      errorMessages: {
        required: 'Choose one primary sector',
      }
    },
    otherSectorName:{
      validators: [''],
    }
  }
}