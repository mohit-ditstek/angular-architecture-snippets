import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/core/services/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private commonHttpService: CommonHttpService) { }

  getNotifications(pageSize = 10) {
    return this.commonHttpService.get(`notification?pageSize=${pageSize}&pageNumber=1`)
  }

  markNotificationsRead(ids) {
    return this.commonHttpService.patch(`notification/markAsRead?ids=${ids.join(',')}`, {})
  }

  createNotification(payload) {
    return this.commonHttpService.post(`notification`, payload)
  }
}
