import { Validators } from "@angular/forms"
import { CompanyRequest } from "src/app/entrepreneur/models/company"

export const getFormConfig = (company: CompanyRequest, currencyOptions) => {
    const {
        salesDetail
    } = company
    return {
        salesEmployees: {
          validators: [salesDetail?.employees],
          errorMessages: {
            required: 'Number of employees is a required field',
          }
        },
        salesTarget: {
          salesTargetDropDown: {
            validators: [salesDetail?.salesTargetCurrency?.id || currencyOptions[0]?.key],
            errorMessages: {
              required: 'Currency Type is a required field',
            }
          },
          salesTargetInput: {
            validators: [salesDetail?.salesTarget || ''],
            errorMessages: {
              required: 'Sales target is a required field',
            }
          }
        },
        salesAchieved: {
          salesAchievedDropDown: {
            validators: [salesDetail?.currentSalesCurrency?.id || currencyOptions[0]?.key],
            errorMessages: {
              required: 'Currency Type is a required field',
            }
          },
          salesAchievedInput: {
            validators: [salesDetail?.currentSales || ''],
            errorMessages: {
              required: 'Sales target is a required field',
            }
          }
        },
        salesPlan: {
          validators: [!!salesDetail?.salesPlanReport]
        },
        salesPlanReport: {
          validators: [salesDetail?.salesPlanReport || ''],
        },
      }
}