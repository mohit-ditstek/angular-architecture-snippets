import { Validators } from "@angular/forms";
import { InvestmentRequest } from "src/app/investor/models/investment";

export const getStageRequirementFormConfig = (investmentStageOptions, stageOptions, companyTypeOptions, investment: InvestmentRequest) => {
    const id = `StageRequirements`
    return {
        investmentStage: {
            validators: [investment?.investmentStage?.id, Validators.compose([Validators.required])],
            options: investmentStageOptions,
            errorMessages: {
                required: 'Investment Stage is a required field'
            },
            id : `investmentStage${id}`
        },
        companyStage: {
            validators: [investment?.companyStage?.id, Validators.compose([Validators.required])],
            options: stageOptions,
            errorMessages: {
                required: 'Company Stage is a required field'
            },
            id : `companyStage${id}`
        },
        companyType: {
            validators: [investment?.companyType?.id, Validators.compose([Validators.required])],
            options: companyTypeOptions,
            errorMessages: {
                required: 'Company Type is a required field'
            },
            id : `companyType${id}`
        },
    }
}