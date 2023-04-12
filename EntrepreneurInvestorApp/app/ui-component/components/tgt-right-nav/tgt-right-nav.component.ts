import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tgt-right-nav',
  templateUrl: './tgt-right-nav.component.html',
  styleUrls: ['./tgt-right-nav.component.scss']
})
export class TgtRightNavComponent implements OnInit {

  @Input() withOfficeIcons: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
