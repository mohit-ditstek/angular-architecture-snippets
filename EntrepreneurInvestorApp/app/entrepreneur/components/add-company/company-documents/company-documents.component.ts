import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyRequest } from 'src/app/entrepreneur/models/company';
import { CompanyService } from 'src/app/entrepreneur/services/company.service';
import { FileService } from 'src/app/shared/services/file.service';
import { TGTForm } from 'src/app/ui-component/components/form-controls/tgt-form/tgt-form';
import { getFormConfig } from './company-document.form.config';

@Component({
  selector: 'app-company-documents',
  templateUrl: './company-documents.component.html',
  styleUrls: ['./company-documents.component.scss']
})
export class CompanyDocumentsComponent extends TGTForm implements OnInit, OnChanges {

  @Input() documentTypes: Array<any> = []
  @Input() company: CompanyRequest

  constructor(
    public _formBuilder: FormBuilder,
    private fileService: FileService,
    private companyService: CompanyService
  ) {
    super(_formBuilder)
  }

  ngOnInit() {
    this.initFormConfig()
  }

  ngOnChanges() {
    this.initFormConfig()
  }

  initFormConfig() {
    this.documentTypes && this.initialize(getFormConfig(this.company, this.documentTypes))
  }

  mapDocumentResponse(documentResponse, documentList) {
    return documentList.reduce((map, document, i) => {
      const documentType = this.documentTypes.find(doc => doc.id == document)
      const name = documentType.type
      const s3Key = documentResponse[i].s3Key
      const entityId = this.company?.id
      return {
        ...map,
        [document]: {
          name,
          s3Key,
          type: documentType,
          entityId
        }
      }
    }, {})
  }

  async uploadDocuments() {

    const formData = new FormData();
    const documentList = []

    Object.keys(this.formGroup.controls)
      .filter(key => this.formGroup.controls[key].value && typeof this.formGroup.controls[key].value !== 'string')
      .map(key => {
        formData.append('files', this.formGroup.controls[key].value, this.formGroup.controls[key].value.name)
        documentList.push(key)
      })
    if (documentList.length) {
      const documentResponse = await this.fileService.uploadFile(formData).toPromise()
      return this.mapDocumentResponse(documentResponse, documentList)
    }
    return {}
  }

  async save() {
    const existingDocuments = this.company?.documents || []

// attach entityid to existing documents
    if (existingDocuments) {
      this.company.documents.forEach(doc => {
        doc.entityId = this.company?.id
      })
    }

    const existingDocumentsMap = existingDocuments.reduce((map, document) => ({
      ...map,
      [document.type.id]: document
    }), {})

    this.documentTypes.forEach(docType => {
      if (!this.formGroup.controls[docType.id].value) {
        existingDocumentsMap[docType.id] = null
      }
    })

    const newDocumentsMap = await this.uploadDocuments()
    const documentsMap = {
      ...existingDocumentsMap,
      ...newDocumentsMap
    }
    const documents = Object.keys(documentsMap).map(key => documentsMap[key]).filter(doc => !!doc)
    return this.companyService.updateCompany(this.company.id, { documents })
  }

}
