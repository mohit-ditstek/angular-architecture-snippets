import { Validators } from "@angular/forms";
import { CompanyRequest } from "src/app/entrepreneur/models/company";

export const getCompanyDetailsFormConfig = (company: CompanyRequest, stages) => {
  const id = `CompanyDetails`
  const{
    logoKey = null,
    logoUrl,
    stage,
    name,
    description
  } = company
  return {
    logoUrl:{
      validators: [logoUrl],
    },
    logoKey:{
      validators: [logoKey]
    },
    name: {
      validators: [name, Validators.compose([Validators.required, Validators.maxLength(50)])],
      errorMessages: {
        required: 'Name of the Company is a required field',
        maxLength: 'Name of the Company cannot have more than 50 character'
      },
      id : `name${id}`
    },
    stage: {
      validators: [stage && stage.id, Validators.compose([Validators.required])],
      options: stages,
      errorMessages: {
        required: 'Stage is a required field'
      },
      id : `stage${id}`
    },
    description: {
      validators: [description, Validators.compose([Validators.required])],
      errorMessages: {
        required: 'About The Company is a required field',
      },
      id : `description${id}`
    }
  }
}