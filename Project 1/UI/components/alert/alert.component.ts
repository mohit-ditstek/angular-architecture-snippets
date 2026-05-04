import { Component, Input } from '@angular/core';

type AlertType = 'danger' | 'warning' | 'info';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() type: AlertType;
  @Input() messageKey: string;
}
