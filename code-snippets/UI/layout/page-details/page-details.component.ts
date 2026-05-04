import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss'],
})
export class PageDetailsComponent {
  @Input() heading = '';
  @Input() subHeading = '';
  @Input() showBack = true;
  @Output() back = new EventEmitter<void>();

  handleBack() {
    this.back.emit();
  }
}

