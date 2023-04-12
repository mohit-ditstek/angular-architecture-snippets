import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tgt-modal',
  templateUrl: './tgt-modal.component.html',
  styleUrls: ['./tgt-modal.component.scss']
})
export class TgtModalComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
