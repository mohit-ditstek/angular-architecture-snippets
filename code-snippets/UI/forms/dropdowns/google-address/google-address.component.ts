import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '@app/base';
import { Address, ConfigItemType, Country, GoogleAddress } from '@app/entities';
import { EventService, RxjsService } from '@app/shared/services';

@Component({
selector: 'app-google-address',
  templateUrl: './google-address.component.html',

})
export class GoogleAddressComponent extends BaseFormComponent implements AfterViewInit {
  @ViewChild('form', { static: false }) public form: NgForm;
  type: ConfigItemType = ConfigItemType.USStates;

  @Input() prefix: number;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() isExpandedOnTablet = false;
  @Input() addressForm = new Address();
  @Input() tabindex: number;
  @Input() required = true;
  @Input() checkboxVisible = false;
  @Input() notSameAsAbove = true;
  @Input() addressFxFlexPercent = false;
  @Input() checkboxLabel: string;
  @Input() isCountyRequired = false;
  @Input() disabled = false;
  @Input() fxFlexPercent = '50%';
  @Input() addressFxFlexWidth = '75%';

  @Output() valuesChanged = new EventEmitter<Address>();
  @Output() notSameAsAboveChanged = new EventEmitter<boolean>();
  @Input() autoFocus?: boolean = false;

  focusUnitField: boolean;

  constructor(public override eventService: EventService, public override rxjsService: RxjsService) {
    super(eventService, rxjsService);
  }

  googleAddressData(googleAddress: GoogleAddress) {
    this.addressForm.address = googleAddress.address;
    this.addressForm.unitNo = googleAddress?.suiteNo;
    this.addressForm.city = googleAddress.city;
    this.addressForm.state = googleAddress.state;
    this.addressForm.county = googleAddress.county;
    this.addressForm.country = googleAddress.country;
    this.addressForm.zipCode = googleAddress.zipCode;
    this.addressForm.googlePlaceId = googleAddress.googlePlaceId;

    this.focusUnitField = true;
  }


  ngAfterViewInit(): void {
    this.registerFormValueChange(0);
    this.markAsPristine();
  }

  public override formValuesChanged(): void {
    if (this.form.dirty) {
      this.valuesChanged.emit(this.addressForm);
    }
  }

  onValueChange() {
    this.focusUnitField = false;

    this.addressForm.googlePlaceId = null;
    this.addressForm.country = Country.UnitedState;
  }

  onNotSameAsAboveCheckboxChanged(event: boolean) {
    this.notSameAsAboveChanged.emit(event);
  }

  bulidPrefix(num: number) {
    return Number(`${this.prefix}${num}`);
  }

  get addressFieldWidth() {
     return this.addressFxFlexPercent ? this.addressFxFlexWidth : this.fxFlexPercent;

  }

  get unitFieldWidth() {
    return this.addressFxFlexPercent ? '25%' : this.fxFlexPercent;
  }
}
