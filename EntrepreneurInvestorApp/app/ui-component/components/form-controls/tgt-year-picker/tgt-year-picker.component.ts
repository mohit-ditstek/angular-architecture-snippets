import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    yearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'tgt-year-picker',
  templateUrl: './tgt-year-picker.component.html',
  styleUrls: ['./tgt-year-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class TgtYearPickerComponent implements OnInit, OnChanges {

  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() placeholder: string = 'YYYY';
  @Input() errorMessage: string = '';
  @Input() required: boolean = false;
  @Input() minDate;
  @Input() maxDate;
  @Input() id:string=''
  selectedDate: Date;

  constructor(public datepipe: DatePipe) { }

  ngOnInit() {
    const selectedYear = this.form.controls[this.controlName].value
    if (selectedYear)
      this.selectedDate = new Date(selectedYear, 5, 5, 0, 0, 0, 0)
    else this.selectedDate = null
  }

  ngOnChanges() {
    const selectedYear = this.form.controls[this.controlName].value
    if (selectedYear)
      this.selectedDate = new Date(selectedYear, 5, 5, 0, 0, 0, 0)
    else this.selectedDate = null
  }

  onYearChange(date: Date, datepicker: MatDatepicker<Date>) {
    this.form.controls[this.controlName].setValue(this.datepipe.transform(date, 'yyyy'))
    this.selectedDate = date
    datepicker.close();
  }

}
