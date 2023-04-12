import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'tgt-loader',
  templateUrl: './tgt-loader.component.html',
  styleUrls: ['./tgt-loader.component.scss']
})
export class TgtLoaderComponent implements OnInit {

  @Input() width;
  @Input() height;
  @Input() circle: boolean;

  constructor() { }

  ngOnInit() { }

  getStyle() {
    const loaderStyle = {
      'width.px': this.width ? this.width : '',
      'height.px': this.height ? this.height : '',
      'border-radius': this.circle ? '50%' : ''
    }
    return loaderStyle;
  }

}
