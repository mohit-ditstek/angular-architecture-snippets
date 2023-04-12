import { Validators } from "@angular/forms";

export const getFinancialRequirementFormConfig = (currencyOptions, financialRequirement) => {
    const id = `FinancialRequirements`
    return {
        name: {
            validators: [financialRequirement?.name, Validators.compose([Validators.required])],
            errorMessages: {
                required: 'Inv. Profile name is required',
            },
            id : `name${id}`
        },
        amountToInvested: {
            amountToInvestedDropDown: {
                validators: [financialRequirement?.currency?.id || currencyOptions[0]?.key, Validators.compose([Validators.required])],
                options: currencyOptions,
                errorMessages: {
                    required: 'Currency Type is a required field',
                }
            },
            amountToInvestedInput: {
                validators: [financialRequirement?.amountToInvest, Validators.compose([Validators.required])],
                errorMessages: {
                    required: 'Amount Invested is a required field',
                },
                id : `amountToInvested${id}`
            }
        },
        roi: {
            validators: [financialRequirement?.roi, Validators.compose([Validators.required])],
            errorMessages: {
                required: 'Expected ROI is required field',
                max: 'Expected ROI should be between 0-100',
                min: 'Expected ROI should be between 0-100',
            },
            id : `roi${id}`
        },
        exitPeriod: {
            validators: [financialRequirement?.exitPeriod, Validators.compose([Validators.required])],
            errorMessages: {
                required: 'Exit period is a required field',
            },
            id : `exitPeriod${id}`
        },
        investorType: {
            validators: [financialRequirement?.investorType, Validators.compose([Validators.required])],
            options: [{ key: "ACTIVE", value: "Active" }, { key: "SEMI_ACTIVE", value: "Semi Active" }, { key: "SLEEPING", value: "Sleeping" }],
            errorMessages: {
                required: 'Level of involvement is a required',
            }
        },
    }
}