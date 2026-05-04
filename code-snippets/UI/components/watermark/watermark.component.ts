import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-watermark',
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.component.scss'],
})
export class WatermarkComponent {
  @Input() text: string;
  @Input() className: string;
}
