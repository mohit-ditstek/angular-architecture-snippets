import { Component, Input, OnInit } from '@angular/core';
import { Investor } from '../../../models/investor';

@Component({
  selector: 'app-trending-enterpreneur',
  templateUrl: './trending-enterpreneur.component.html',
  styleUrls: ['./trending-enterpreneur.component.scss']
})
export class TrendingEnterpreneurComponent implements OnInit {

  @Input() trendingEnterprenuers: Array<Investor>

  constructor() { }

  ngOnInit() {
  }

}
