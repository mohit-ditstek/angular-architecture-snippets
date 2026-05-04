import { Component, EventEmitter, Output } from '@angular/core';
import { SortDirection } from '@app/entities';
@Component({
  template: '',
})
export abstract class BaseGridPageComponent {
  readonly defaultSortColumn = 'lastUpdatedUtc';
  readonly defaultSortDirection = SortDirection.Descending;
  @Output() scrolled = new EventEmitter<any>();
  @Output() sort = new EventEmitter<any>();

  sortData(event) {
    this.sort.emit(event);
  }

  abstract rowClick(details);

  onScrollDown() {
    this.scrolled.emit();
  }
}
