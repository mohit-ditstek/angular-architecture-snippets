import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'tgt-toggle',
  templateUrl: './tgt-toggle.component.html',
  styleUrls: ['./tgt-toggle.component.scss']
})
export class TgtToggleComponent implements OnInit {


  @Input() controlName: string = ''
  @Input() form: FormGroup
  @Input() label: string = ''
  @Input() required: boolean = false;
  @Output() change = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit() {
  }

  onToggle(event){
    this.change.emit(event);
  }

}
