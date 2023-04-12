import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tgt-page-loader',
  templateUrl: './tgt-page-loader.component.html',
  styleUrls: ['./tgt-page-loader.component.scss']
})
export class TgtPageLoaderComponent implements OnInit {
  @Input() isLoading: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
