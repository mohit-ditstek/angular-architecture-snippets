import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() tooltipText: string;
  @Input() class: string;
  @Input() color: string;
  @Input() buttonIcon: string;
  @Input() buttonText: string;
  @Input() disableControl = false;

}
