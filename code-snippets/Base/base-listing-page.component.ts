import { ElementRef } from '@angular/core';
import { AdminPermission, BaseServerSideFilterModel, DateRange, EntityType, Permission, SortDirection } from '@app/entities';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

export abstract class BaseListingPageComponent {
  abstract contentElement?: ElementRef;
  abstract entityType: EntityType;

  readonly AvailablePermissions = Permission;
  readonly AvailableAdminPermissions = AdminPermission;
  readonly defaultPageSize = 20;

  subscription = new Subscription();
  dateRange: DateRange;

  filterRequest = new BaseServerSideFilterModel();

  abstract getRecords(filter?: boolean): void;

  constructor() {
    const { dateRange } = history.state || {};

    if (dateRange) {
      this.dateRange = {
        startDate: moment(dateRange.startDate),
        endDate: moment(dateRange?.endDate),
      };

      this.filterRequest.newOnly = true;
      this.filterRequest.startDate = this.dateRange.startDate.format('YYYY-MM-DD');
      this.filterRequest.endDate = this.dateRange.endDate.format('YYYY-MM-DD');
      this.filterRequest.pageSize = this.defaultPageSize;
    }
  }

  computePageSize(filterHeight = 81, headerHeight = 36, rowHeight = 48) {
    const containerHeight = this.contentElement.nativeElement.clientHeight;
    const gridBodyHeight = containerHeight - filterHeight - headerHeight;

    const pageSize = Math.ceil(gridBodyHeight / rowHeight) + 5;
    return pageSize;
  }

  filterChanged(payload: object) {
    this.filterRequest = {
      ...this.filterRequest,
      ...payload,
      page: 1,
      newOnly: false,
    };

    this.getRecords();
  }

  sortData(event) {
    this.filterRequest.page = 1;
    this.filterRequest.sort = event.direction == SortDirection.Descending ? '-' + event.active : event.active;

    this.getRecords(false);
  }

  refresh() {
    this.filterRequest.page = 1;
    this.filterRequest.loaded = false;
    this.getRecords(false);
  }

  onScrollDown() {
    const { page } = this.filterRequest;
    this.filterRequest.page = page + 1;
    this.filterRequest.loaded = true;
    this.getRecords(false);
  }

  destroy() {
    this.subscription.unsubscribe();
  }
}
