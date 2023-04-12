export interface InvestmentRequest {
    companyType?: CompanyType,
    createdBy?: string,
    createdDate?: Date,
    financialRequirement?: FinancialRequirement,
    id?: number,
    investmentStage?: InvestmentStage,
    lastModifiedBy?: string,
    lastModifiedDate?: Date,
    sectors?: Array<Sectors>,
    companyStage?: CompanyStage
    version?: number
}

export interface CompanyType {
    id: number,
    type: string
}

export interface InvestmentStage {
    id: number,
    name: string
}

export interface CompanyStage {
    id: number,
    order: number
}

export interface Sectors {
    id: number,
    isPrimary: boolean,
    name?: string
}

export interface FinancialRequirement {
    amountToInvest: number,
    currency: CurrencyDetail
    exitPeriod: number,
    investorType: string,
    name: string,
    roi: number
}

export interface CurrencyDetail {
    id: number,
    name: string,
    symbol: string
}