import { Validators } from "@angular/forms"
import { Utils } from "src/app/core/util/utils";
import { CompanyRequest } from "src/app/entrepreneur/models/company";

const id: string = `CompanyDetailByType`

export const companyIncorporatedForm = ({ isIncorporated = false }) => ({
  companyIncorporated: {
    validators: [isIncorporated],
    errorMessages: {
      required: '',
    }
  }
})

export const partnerFormConfig = partner => ({
  name: {
    label: 'Partner Name',
    validators: [partner?.name || '', Validators.compose([Validators.required])],
    errorMessages: {
      required: 'Partner Name is required',
    },
    id: `name${id}`
  },
  email: {
    label: 'Partner Email',
    validators: [partner?.email || '', Validators.compose([Validators.required, Validators.pattern(Utils.emailRegEx)])],
    errorMessages: {
      required: 'Partner Email is required',
      pattern: 'Please enter a valid email'
    },
    id: `email${id}`
  },
  sharePercentage: {
    label: 'Share Percentage',
    validators: [partner?.sharePercentage || '', Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
    errorMessages: {
      required: 'Share percentage is required',
      max: 'Share percentage should be between 0-100',
      min: 'Share percentage should be between 0-100',
    },
    id: `sharePercentage${id}`
  },
  partnerType: {
    label: 'Are you a founder/co-founder?',
    validators: [partner?.partnerType || '', Validators.compose([Validators.required])],
    options: [{ key: 'FOUNDER', value: "Founder" }, { key: 'CO_FOUNDER', value: "Co-Founder" }],
    errorMessages: {
      required: 'Founder/co-founder is required',
    }
  },
  isBoardMember: {
    label: 'Are you a board member?',
    validators: [partner?.isBoardMember || false],
  }
})

export const companyDetailsByTypeFormConfig = (company: CompanyRequest, companyTypes) => {
  const {
    companyType,
    cin = '',
    llpin = '',
    gstNumber = '',
    incorporationYear
  } = company?.companyTypeDetail || {}
return {
    companyType: {
      validators: [companyType?.id || 1, Validators.compose([Validators.required])],
      options: companyTypes.map(type => ({ key: type.id, value: type.type })),
      errorMessages: {
        required: 'Company Type is required',
      },
      id: `companyType${id}`
    },
    companyIncorporated: {
      validators: [true],
      errorMessages: {
        required: '',
      }
    },
    yearOfIncorporation: {
      validators: [incorporationYear, Validators.compose([Validators.required])],
      errorMessages: {
        required: 'Year of incorporation is required',
      },
      id: `yearOfIncorporation${id}`
    },
    cinNumber: {
      validators: [cin, Validators.compose([Validators.required, Validators.pattern(Utils.cinRegEx), Validators.maxLength(21), Validators.minLength(21)])],
      errorMessages: {
        required: 'CIN number is required',
        pattern: 'Enter valid CIN code (e.g.: L12345AA1234AAA123456)',
        maxlength: 'CIN number should be of 21 digit',
        minlength: 'CIN number should be of 21 digit',
      },
      id: `cinNumber${id}`
    },
    llpNumber: {
      validators :[llpin, Validators.compose([Validators.required, Validators.pattern(Utils.llpRegEx), Validators.maxLength(8), Validators.minLength(8)])],
      errorMessages: {
        required: 'LLP number is required',
        pattern: 'Enter valid LLP code (e.g.: AAX-3828)',
        maxlength: 'LLP number should be of 8 digit',
        minlength: 'LLP number should be of 8 digit',
      },
      id: `llpNumber${id}`
    },
    gstNumber: {
      validators: [gstNumber, Validators.compose([Validators.maxLength(15), Validators.minLength(15)])],
      errorMessages: {
        required: 'Year of incorporation is required',
        maxlength: 'GST number should be of 15 digit',
        minlength: 'GST number should be of 15 digit'
      }
    }
  }
   
}

export const partnerConfigByCompanyType = (companyType) => {
  const partnerConfig = {
    1: partnerFormConfig(null),
    2: null,
    3: partnerFormConfig(null),
    4: null,
    5: partnerFormConfig(null)
  }
  return partnerConfig[companyType]
}

