import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CommonHttpService } from 'src/app/core/services/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private sideNav = new BehaviorSubject<any>(null);

  constructor(private commonHttpService: CommonHttpService) { }

  updateSideNav(data) {
    this.sideNav.next(data);
  }

  getSideNav(): Observable<any> {
    return this.sideNav.asObservable();
  }

  getDocuments(entityType, entityId) {
    return this.commonHttpService.get(`document/${entityType}/${entityId}`)
  }

  getConnections(param) {
    const params = new HttpParams()
      .set('pageNumber', `${param.pageNumber}`)
      .set('pageSize', `${param.pageSize}`)
    return this.commonHttpService.get(`connections?${params}`)
  }

  createDocument(entityType, formData) {
    return this.commonHttpService.post(`document/${entityType}`, formData)
  }

  copyPasteDocument(entityType, formData) {
    return this.commonHttpService.post(`document/copy/${entityType}`, formData)
  }


  getDocumentType(entityType) {
    return this.commonHttpService.get(`documentType/${entityType}`);
  }

  getAllDocumentsForUser() {
    return this.commonHttpService.get(`document`);
  }

  deleteDocmuent(id){
    return this.commonHttpService.delete(`document`,id);
  }

  getIndicativeIJ(){
    return this.commonHttpService.get('indicativeIJ')
  }

}
