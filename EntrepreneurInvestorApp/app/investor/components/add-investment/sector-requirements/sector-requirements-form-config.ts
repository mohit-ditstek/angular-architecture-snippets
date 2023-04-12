import { FormArray, FormControl, Validators } from "@angular/forms";

export const getInvestmentDetailsSectorFormConfig = (investment, sectorList) => {
  let primarySector = null
  const controlArray = sectorList.map(sector => {
    const selectedSector = investment?.sectors?.find(selectedSector => selectedSector.id === sector.id)
    if (selectedSector?.isPrimary)
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
    otherSectorName :{
      validators: [''],
    }
  }
}