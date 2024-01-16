import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Address, Country, GoogleAddress } from '@app/entities';
import { EventService, MockEventService, MockRxjsService, RxjsService } from '@app/shared/services';
import { GoogleAddressComponent } from './google-address.component';
describe('GoogleAddressComponent', () => {
  let component: GoogleAddressComponent;
  let fixture: ComponentFixture<GoogleAddressComponent>;
  let form: NgForm;
  let eventService: EventService;
  let rxjsService: RxjsService;
  const googleAdds: GoogleAddress = {
    address: 'Street',
    city: 'Reno',
    country: 'United States',
    county: 'Washoe County',
    locationName: 'Reno',
    phone: '1234567890',
    googlePlaceId: 'ChIJnaCSkq5AmYARh_c4dM7FxUA',
    state: 'Nevada',
    website: 'http://www.reno.com/',
    zipCode: '5321',
    isValid: true,
    isDirty: false,
  };

  let data: Address = {
    address: 'Street',
    city: 'Reno',
    state: 'Nevada',
    zipCode: '5321',
    unitNo: null,
    county: 'Washoe County',
    country: 'United States',
    googlePlaceId: 'ChIJnaCSkq5AmYARh_c4dM7FxUA',
    isValid: true,
    isDirty: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleAddressComponent],
      imports: [FormsModule, TranslateModule.forRoot({}), FlexLayoutModule],
      providers: [
        { provide: EventService, usevalue: MockEventService },
        { provide: RxjsService, usevalue: MockRxjsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAddressComponent);
    component = fixture.componentInstance;
    component.form = form;
    fixture.detectChanges();
    eventService = TestBed.inject(EventService);
    rxjsService = TestBed.inject(RxjsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the google address data function', () => {
    const { state, city, address, zipCode, suiteNo } = googleAdds;
    data = { ...data, state, city, address, zipCode, unitNo: suiteNo };

    component.googleAddressData(googleAdds);
    expect(component.addressForm).toEqual(data);
    expect(component.focusUnitField).toBe(true);
  });

  it('should check formValuesChanged method', () => {
    const spyOnEvent = jest.spyOn(component.valuesChanged, 'emit');
    component.form = { ...component.form, dirty: true } as NgForm;
    component.formValuesChanged();

    expect(spyOnEvent).toHaveBeenCalledWith(component.addressForm);
  });

  it('should handle onValueChange method', () => {
    component.onValueChange();
    expect(component.focusUnitField).toEqual(false);
    expect(component.addressForm.country).toEqual(Country.UnitedState);
  });

  it('should handle change checkbox method', () => {
    const spyOnEvent = jest.spyOn(component.notSameAsAboveChanged, 'emit');
    component.onNotSameAsAboveCheckboxChanged(true);
    expect(spyOnEvent).toHaveBeenCalledWith(true);
  });

  it('should handle buildPrefix method', () => {
    component.prefix = 1;
    const prefixValue = component.bulidPrefix(1);
    expect(prefixValue).toEqual(11);
  });

  describe('should check addressFieldWidth get property', () => {
    it('should check addressFieldWidth is 75%', () => {
      component.addressFxFlexPercent = true;
      expect(component.addressFieldWidth).toBe('75%');
    });
    it('should check addressFieldWidth is 50%', () => {
      component.addressFxFlexPercent = false;
      expect(component.addressFieldWidth).toBe('50%');
    });
  });

  describe('should check unitFieldWidth get property', () => {
    it('should check unitFieldWidth is 75%', () => {
      component.addressFxFlexPercent = true;
      expect(component.addressFieldWidth).toBe('75%');
    });
    it('should check unitFieldWidth is 50%', () => {
      component.addressFxFlexPercent = false;
      expect(component.addressFieldWidth).toBe('50%');
    });
  });
});
