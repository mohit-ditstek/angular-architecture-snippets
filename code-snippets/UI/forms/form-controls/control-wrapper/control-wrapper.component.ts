import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-wrapper',
  templateUrl: './control-wrapper.component.html',
})
export class ControlWrapperComponent {
  @Input() label: string = '';
}