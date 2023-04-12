import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'tgt-perfect-scroll',
  templateUrl: './tgt-perfect-scroll.component.html',
  styleUrls: ['./tgt-perfect-scroll.component.scss']
})
export class TgtPerfectScrollComponent implements OnInit {
  config: PerfectScrollbarConfigInterface = {};
  @Input() styles: string = "";
  @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor() { }

  ngOnInit() {
  }

}
