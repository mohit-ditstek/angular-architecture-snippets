import { Validators } from "@angular/forms";
import { Utils } from "src/app/core/util/utils";

export const executiveFormConfig = (designations) => {
  const id = `Executive`
const executive = {
    associationYear: '',
    designation: "",
    email: "",
    name: ""
}
return {
      name: {
        label: 'Executive Name',
        validators: [executive.name, Validators.compose([Validators.required])],
        errorMessages: {
          required: 'Partner Name is required',
        },
        id : `name${id}`
      },
      email: {
        label: 'Executive Email',
        validators: [executive.email, Validators.compose([Validators.required, Validators.email])],
        errorMessages: {
          required: 'Partner Email is required',
          pattern: 'Please enter a valid email'
        },
        id : `email${id}`
      },
      designation: {
        label: 'Desgination',
        validators: [executive.designation, Validators.compose([Validators.required, Validators.max(100)])],
        options: designations.map(d => ({key: d.name, value: d.name})),
        errorMessages: {
          required: 'Designation is required',
        },
        id : `designation${id}`
      },
      associationYear: {
        label: 'Association year',
        validators: [executive.associationYear, Validators.compose([Validators.required])],
        errorMessages: {
          required: 'Association year is required',
        },
        id : `associationYear${id}`
      }
  }
}

  export const getTeamFormConfig = (company) => {
      const { employeeStrength } = company || {}
      return {
        employeeStrength: {
          validators: [employeeStrength],
          errorMessages: {
            required: 'Number of employees is a required field',
          }
        }
    }

  }