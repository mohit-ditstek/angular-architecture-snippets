import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'tgt-autocomplete',
  templateUrl: './tgt-autocomplete.component.html',
  styleUrls: ['./tgt-autocomplete.component.scss']
})
export class TgtAutocompleteComponent implements OnInit, OnChanges {
  @Input() options: Array<any> = [];
  @Input() controlName: string;
  @Input() name: string='';
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() errorMessage: string = '';
  @Input() icon: string = '';
  @Input() fullWidth: boolean = false
  @Input() placeholder: string = 'Search'
  @Input() required: boolean = false;
  @Input() width: number = -1
  filteredOptions: Observable<any>;
  styles: object

  constructor() {
   }

  ngOnInit(): void {
    this.styles = this.width > -1 ?{
      width: `${this.width}em`
    }: {}
    if(this.options.length)
      this.prepareList()
  }
  ngOnChanges(){
    if(this.options.length)
    this.prepareList()
  }
  prepareList(){
    this.filteredOptions = this.form.controls[this.controlName].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value){
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
  }
}
