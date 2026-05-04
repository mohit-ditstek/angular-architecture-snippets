import { Component, Input } from '@angular/core';

type Size = 'regular' | 'medium' | 'small' | 'x-medium' | 'large';

@Component({
  selector: 'app-filter-wrapper',
  templateUrl: './filter-wrapper.component.html',
  styleUrls: ['./filter-wrapper.component.scss'],
})
export class FilterWrapperComponent {
  @Input() size: Size = 'regular';
  @Input() tabletWidth: string;


  get style() {
    return this.tabletWidth ? { '--tablet-width' : this.tabletWidth} : {};
  }
}
