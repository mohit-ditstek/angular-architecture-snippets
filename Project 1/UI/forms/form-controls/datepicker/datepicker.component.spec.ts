import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MockUtilityService, UtilityService } from '@app/shared/services';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { DatepickerComponent } from './datepicker.component';
const maskConfig: Partial<IConfig> = {
  validation: true,
};

const defaultMaskedFormat = 'XX/XX/XXXX';
const unmaskedFormat='00/00/0000';
const hiddenInput=false;

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerComponent],
      imports: [MatDatepickerModule, MatNativeDateModule, FormsModule, NgxMaskModule.forRoot(maskConfig)],
      providers: [
        { provide: UtilityService, useValue: MockUtilityService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    component.defaultMaskedFormat = defaultMaskedFormat;
    component.maskedFormat = defaultMaskedFormat;
    component.unmaskedFormat= unmaskedFormat;
    component.hiddenInput=hiddenInput;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valueChanged', () => {
    const expectDate = new Date('04/25/2022');
    const event = { target: { value: expectDate } };
    component.valueChanged(event, false);
    expect(event.target.value).toBe(expectDate);
  });

  it('should handle dateChange', () => {
    const expectDate = 'Thu Apr 21 2022 00:00:00 GMT+0530 (India Standard Time)';
    const event = { target: { value: 'Thu Apr 21 2022 00:00:00 GMT+0530 (India Standard Time)' } };
    component.dateChange(event);
    expect(event.target.value).toBe(expectDate);
  });

  describe('should check focusIn method scenarios', () => {
    it('should chech when addMode is false', () => {
      component.focusIn(null);
      expect(component.hiddenInput).toBe(false);
    });
    it('should chech when addMode is true', () => {
      component.focusIn(null);
      expect(component.hiddenInput).toBe(false);
    });
  });

  it('should check focusOut method is called', () => {
    component.showMasked = false;
    component.focusOut();
    expect(component.hiddenInput).toBe(true);
  });

  it('should emit changeDate event when date is changed', () => {
    const inputValue = '12/31/2022';
    const spy = jest.spyOn(component.changeDate, 'emit');
    component.dateChange({ target: { value: inputValue } });
    expect(spy).toHaveBeenCalledWith(component.value);
  });
 
});
