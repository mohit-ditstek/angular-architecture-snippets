import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stroked-button',
  templateUrl: './stroked-button.component.html',

})
export class StrokedButtonComponent {
  @Input() tooltipText: string;
  @Input() class: string;
  @Input() buttonIcon: string;
  @Input() buttonText: string;
  @Input() disableControl = false;
  @Input() iconAlignmentRight = false;
  @Input() color: string;

}
