import { Validators } from "@angular/forms";
import { CompanyRequest } from "src/app/entrepreneur/models/company";

export const getCompanyAddressFormConfig = (company: CompanyRequest, countries: Array<any> = [], selectedCountry) => {
    const id = `CompanyAdress`
    const { 
        address = "",
        city = "",
        country = selectedCountry,
        pincode = "",
        state = ""
    } = company?.companyAddress || {}
    return {
        country: {
            validators: [country, Validators.compose([Validators.required])],
            options: countries.map(country => ({ key: country.countryCode, value: country.name })),
            errorMessages: {
                required: 'Country is a required field',
            },
            id : `country${id}`
        },
        pincode: {
            validators: [pincode, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
            errorMessages: {
                required: 'Pincode is a required field',
                minlength: 'Enter valid Pincode',
                maxlength: 'Enter valid Pincode'
            },
            id : `pincode${id}`
        },
        address: {
            validators: [address],
            errorMessages: {
                required: 'Address is a required field',
                maxlength: 'Address cannot have more than 100 character'
            }
        },
        city: {
            validators: [city, Validators.compose([Validators.required])],
            errorMessages: {
                required: 'City is a required field'
            },
            id : `city${id}`
        },
        state: {
            validators: [state],
            errorMessages: {
                required: 'State is a required field',
            }
        },
    };
}