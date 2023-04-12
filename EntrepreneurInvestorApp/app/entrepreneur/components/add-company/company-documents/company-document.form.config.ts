import { CompanyRequest } from "src/app/entrepreneur/models/company"

export const getFormConfig = (company: CompanyRequest, documentOptions = []) =>{
    const {     
        documents
    } = company

    return documentOptions.reduce((documentForm, documentOption) =>{
        const documentName = documents?.find(doc => doc.type.id === documentOption.id)?.name
        
        documentForm[documentOption.id] = {
            validators: [documentName || null],
            label: documentOption.type,
            name: documentName
        }
        return documentForm
    }, {})
}
