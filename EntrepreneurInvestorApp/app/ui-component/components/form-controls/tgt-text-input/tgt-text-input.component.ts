import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Utils } from 'src/app/core/util/utils';

@Component({
  selector: 'tgt-text-input',
  templateUrl: './tgt-text-input.component.html',
  styleUrls: ['./tgt-text-input.component.scss']
})
export class TgtTextInputComponent implements OnInit {

  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() type: string;
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() maxlength: number;
  @Input() icon: string = '';
  @Input() fullWidth: boolean = false
  @Input() size: string = 'md'
  @Input() required: boolean = false;
  @Input() suffix: string = '';
  @Input() mask = '';
  @Input() isUppercaseRequired: boolean = false;
  @Input() id:string=''
  @Input() width: number = -1
  inputType: string = "text";
  styles: object

  constructor() { }

  ngOnInit() {
    this.inputType = this.type === "number" ? "text" : this.type;
    this.styles = this.width > -1 ?{
      width: `${this.width}em`
    }: {}
  }

  validate(event: any) {
    if (this.type === "number") {
      Utils.allowNumber(event);
    }
  }
  transformTextToUppercase(event){
    if(this.isUppercaseRequired){
      this.form.controls[this.controlName].setValue(event.target.value.toUpperCase())
    }else{
      this.form.controls[this.controlName].setValue(event.target.value)
    }
  }
}
