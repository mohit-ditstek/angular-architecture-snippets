import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
})
export class PageComponent {
  @Input() title: string;
  @Input() bodyClass = 'commonCard';
  
}
