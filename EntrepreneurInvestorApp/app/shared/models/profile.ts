export interface ProfileRequest {
    additionalProfileDetail?: AdditionalProfileDetailRequest
    academicDetails?: Array<AcademicDetailRequest>
    awardAndCertificationDetails?: Array<AwardAndCertificationDetailRequest>
    createdBy?: string,
    createdDate?: Date,
    dateOfBirth: Date,
    email?: string,
    gender: string,
    id?: number,
    lastModifiedBy?: string,
    lastModifiedDate?: Date,
    countryCode?: string,
    mobile?: string,
    name: string,
    pictureKey: string,
    pictureUrl?: string,
    patentAndIpDetails?: Array<PatentAndIpDetailsDetailRequest>
    professionalHistories?: Array<ProfessionalHistoryDetailRequest>
    roles?: Array<string>
    version?: number
}



export interface AdditionalProfileDetailRequest {
    aadhaar: string,
    address: Address,
    din: string,
    id: number,
    languages?: Array<string>,
    pan: string
}
export interface Address {
    address: string,
    city: string,
    country: string,
    pincode: string,
    state: string
}
export interface AcademicDetailRequest {
    branch: string,
    college: string,
    degree: string,
    endYear: number,
    id: number,
    isCurrent: boolean,
    startYear: number
}

export interface AwardAndCertificationDetailRequest {
    issueYear: number,
    issuedBy: string,
    title: string,
    type: string
}
export interface ProfessionalHistoryDetailRequest {
    company: string,
    employmentType: string,
    endYear: number,
    id: number,
    isCurrent: boolean,
    startYear: number,
    title: string
}

export interface PatentAndIpDetailsDetailRequest {
    fileDate: Date,

    inventorDetails?: Array<InventorDetail>
    issueDate: Date,
    patentNumber: string,
    status: string,
    title: string
}

export interface InventorDetail {

    name: string,
    type: string
}






