import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tgt-star-rating',
  templateUrl: './tgt-star-rating.component.html',
  styleUrls: ['./tgt-star-rating.component.scss']
})
export class TgtStarRatingComponent implements OnInit {

  @Input() rating: number;
  constructor() { }

  ngOnInit() {
  }

}
