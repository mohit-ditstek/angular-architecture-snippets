import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-skeleton-loader',
  templateUrl: './notification-skeleton-loader.component.html',
  styleUrls: ['./notification-skeleton-loader.component.scss']
})
export class NotificationSkeletonLoaderComponent {
  @Input() padding:boolean;
  items = [1,2,3,4,5];
}
