import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-skeleton-loader',
  templateUrl: './detail-skeleton-loader.component.html',
  styleUrls: ['./detail-skeleton-loader.component.scss'],
})
export class DetailSkeletonLoaderComponent {
  @Input() padding = false;

  items(i: number) {
    return new Array(i);
  }
}
