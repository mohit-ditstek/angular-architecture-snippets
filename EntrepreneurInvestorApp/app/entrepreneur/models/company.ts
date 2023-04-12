import { Currency } from "src/app/shared/models/currency";

export interface CompanyRequest {
    id?: number,
    logoUrl?: string,
    logoKey?: string,
    name: string,
    description: string,
    stage: CompanyStage,
    createdBy?: string,
    createdDate?: Date,
    companyAddress?: CompanyAddress,
    companyTypeDetail?: CompanyDetailByType,
    documents?: Array<CompanyDocument>,
    employeeStrength?: string,
    executives?: Array<Executive>,
    financialStatus?: FinancialStatus,
    gtmDetail?:GTMDetail,
    investmentOpportunities?: Array<InvestmentOpportunity>,
    isInvestmentRequired?: boolean,
    isCompanyHidden?: boolean,
    isIncorporated?: boolean,
    lastModifiedBy?: string,
    lastModifiedDate?: Date,
    maturityStatuses?: Array<MaturityStatus>,
    revenueDetail?: RevenueDetail,
    salesDetail?: SalesDetail,
    sectors?: Array<CompanySector>,
    version?: number
}
export interface CompanyDocument {
    id?: number,
    name?: string,
    s3Key: string,
    entityId?:number,
    type: {
      id: number
    }
}

export interface SalesDetail  {
    currentSales?: number,
    currentSalesCurrency?: Currency,
    employees: string,
    salesPlanReport: string,
    salesTarget: number,
    salesTargetCurrency: Currency
  }
export interface GTMDetail  {
    cacCost: number,
    cacCurrency: Currency,
    gtmDeck: string,
    stage: string
  }

export interface MaturityStatus {
    departmentType: {
        name: string,
        value: string
    },
    operationalStatus: {
        name: string,
        value: string
    }
}
export interface CompanyDocument {
    id?: number,
    name?: string,
    s3Key: string,
    type: {
      id: number
    }
}
export interface InvestmentOpportunity {
    id?: number,
    investmentCurrency?: Currency,
    investmentEquityPercent: number,
    investmentRequired: number,
    investmentStage: {
        id: number,
    },
    investorType: string,
    valuation: number,
    valuationCurrency?: Currency,
    valuationReport: string,
}

export interface RevenueDetail {
    currency: {
        id: number
    },
    revenue: 0
}

export interface FinancialStatus {
    percentage: number,
    type: string
}

export interface Executive {
    name: string,
    email: string,
    designation: string,
    associationYear: number
}

export interface CompanySector {
    id: number,
    isPrimary: boolean,
    name:string
}

export interface CompanyStage {
    id: number
}

export interface CompanyAddress {
    address: string,
    city: string,
    country: string,
    pincode: string,
    state: string
}

export interface CompanyDetailByType {
    cin: string,
    llpin: string,
    companyType: CompanyType,
    gstNumber: string,
    incorporationYear: number,
    partners: Array<CompanyPartner>
}

export interface CompanyType {
    id: number
}

export interface CompanyPartner {
    name: string,
    email: string,
    isBoardMember: boolean,
    partnerType: string,
    sharePercentage: number
}

export interface Company {
    id: string,
    name: string,
    foundedIn: Date,
    icon: string,
    timeline: Array<Milestone>
    upcomingTask: Task,
    type?: string,
    growthJourney?:Array<Milestone>,
    invJourney?:Array<Milestone>,
    revenue?: string,
    invOpportunities?: any,
    employees?: string,
}

export interface Task {
    name: string,
    date: Date
}

export interface Milestone {
    label: string,
    hasAchieved: boolean,
    active: boolean
}

