import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-investment-made',
  templateUrl: './investment-made.component.html',
  styleUrls: ['./investment-made.component.scss']
})
export class InvestmentMadeComponent implements OnInit {
  @Input() data:any
  constructor() { }

  ngOnInit(): void {
  }

}
