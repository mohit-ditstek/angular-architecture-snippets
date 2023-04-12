import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'tgt-autocomplete-multiselect',
  templateUrl: './tgt-autocomplete-multiselect.component.html',
  styleUrls: ['./tgt-autocomplete-multiselect.component.scss']
})
export class TgtAutocompleteMultiselectComponent implements OnInit, OnChanges {
  @Input() options: Array<any> = [];
  @Input() controlName: string;
  @Input() name: string='';
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() errorMessage: string = '';
  @Input() icon: string = '';
  @Input() fullWidth: boolean = false
  @Input() placeholder: string = 'Select Options'
  @Input() required: boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredOptions: Array<any>;
  selectedOptions: Array<any>=[];

  @ViewChild('autoCompleteInput', {static: false}) autoCompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor() {
  }

  ngOnInit(){
    this.filteredOptions = this.options?.map(opt => ({
      ...opt,
      selected: false
    })) || []
  }

  ngOnChanges(){
    this.filteredOptions = this.filteredOptions?.map(opt =>({
      ...opt,
      selected: this.form.controls[this.controlName]?.value?.includes(opt.key)
    }))||[];
    this.showNoOfSelectedOptions();
  }

  clearInputValue(){
    if(this.autoCompleteInput?.nativeElement)
      this.autoCompleteInput.nativeElement.value = '';
  }

  remove(removedOption): void {
    this.filteredOptions.find(option => option['value'] === removedOption['value']).selected = false
    this.setFormValue()
    this.showNoOfSelectedOptions()
  }

  onSelection(event: MatAutocompleteSelectedEvent): void {
    this.placeholder="";
    this.autoCompleteInput.nativeElement.value = '';
    this.filteredOptions.find(option => option['key'] === event.option.value).selected  = true
    this.setFormValue()
    this.autoCompleteInput.nativeElement.focus();
  }

  showNoOfSelectedOptions(){
    const selectedOptions = this.filteredOptions.filter(opt => opt.selected)
    if(this.autoCompleteInput?.nativeElement)
      this.autoCompleteInput.nativeElement.value = selectedOptions.length === 0 ? '' : `${selectedOptions.length} ${this.name} selected`;
  }

  filterOptions(event:any) {
    this.filteredOptions = this.options.filter(option => option.value.toLowerCase().indexOf((event.target.value).toLowerCase()) === 0);
  }

  setFormValue() {
    this.form.controls[this.controlName].setValue(this.filteredOptions.
      filter(opt => opt.selected).
      map(opt => opt.key))
  }


}
