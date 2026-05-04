import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetConfig } from '../../model';
import { CalendarType } from '../../enum';
import { OrgType } from '@app/entities';

@Component({
  selector: 'app-quick-link-widget',
  templateUrl: './quick-link-widget.component.html',
  styleUrls: ['./quick-link-widget.component.scss'],
})
export class QuickLinkWidgetComponent implements OnInit {
  @Input() widget: WidgetConfig;
  @Input() isDmsEnabled: boolean;
  @Input() filterType: CalendarType;
  @Input() isAdmin: boolean;
  @Input() orgType:OrgType;

  @Output() redirect = new EventEmitter<string>();
  @Output() redirectPage = new EventEmitter<string>();

  CalendarType = CalendarType;
  navigate() {
    this.redirect.emit(this.widget.featureUrl);
  }

  navigateListingPage() {
    this.redirectPage.emit(this.widget.featureUrl);
  }

  ngOnInit(): void {
    const { callback } = this.widget;
    if (callback) callback();
  }
}
