import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-tabs',
  templateUrl: './page-tabs.component.html',
  styleUrls: ['./page-tabs.component.scss'],
})
export class PageTabsComponent {
  @Input() loaded: boolean;
  @Input() heading: string;
  @Input() entityIdLabel?: string;
  @Input() bodyClass = '';
  @Input() cardContainer = true;
  @Input() cardTabletView = false;
  @Input() showTabs= true;
  @Input() showBack = true;
  @Output() back = new EventEmitter<void>();

  handleBack() {
    this.back.emit();
  }
}
