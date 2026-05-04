import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-raised-button',
  templateUrl: './raised-button.component.html',

})
export class RaisedButtonComponent {
  @Input() tooltipText: string;
  @Input() class: string;
  @Input() buttonIcon: string;
  @Input() buttonText: string;
  @Input() disableControl = false;
  @Input() color: string;

}
