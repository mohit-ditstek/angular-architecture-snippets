import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-listing',
  templateUrl: './page-listing.component.html',
  styleUrls: ['./page-listing.component.scss'],
})
export class PageListingComponent {
  @Input() bodyClass: string;
  @Input() loaded: boolean;
  @Input() title: string;
  @Input() showRefresh = true;
  @Input() wrapFilters = false;
  @Input() isLandscape = false;
  @Input() showFilters = true;
  @Output() refresh = new EventEmitter<void>();

  refreshList() {
    this.refresh.emit();
  }

}
