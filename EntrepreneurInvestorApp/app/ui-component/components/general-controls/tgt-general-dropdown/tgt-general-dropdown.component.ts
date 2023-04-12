import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface DropDownOption {
  key: number,
  value: string
}
@Component({
  selector: 'tgt-general-dropdown',
  templateUrl: './tgt-general-dropdown.component.html',
  styleUrls: ['./tgt-general-dropdown.component.scss']
})
export class TgtGeneralDropdownComponent implements OnInit {
  @Input() options: Array<DropDownOption> = [];
  @Input() selectedValue: string;
  @Input() label: string;
  @Input() icon: string = '';
  @Input() errorMessage: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Select Option'
  @Input() fullWidth: boolean = false;
  @Input() id:string=''
  @Output() onChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  handleChange(){
    this.onChange.emit(this.selectedValue)
  }

}
