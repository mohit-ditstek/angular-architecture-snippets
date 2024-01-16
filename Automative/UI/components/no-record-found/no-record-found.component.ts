import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
})
export class NoRecordFoundComponent {
  @Input() message: string;
}
