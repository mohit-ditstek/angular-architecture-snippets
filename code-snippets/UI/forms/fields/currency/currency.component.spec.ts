import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { TextMaskInputComponent } from '../../form-controls';
import { CustomMaxDirective, CustomMinDirective } from '../../validators';

import { CurrencyComponent } from './currency.component';
describe('CurrencyComponent', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyComponent, TextMaskInputComponent, CustomMaxDirective, CustomMinDirective],
      imports: [FormsModule, NgxMaskModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle focusOut inputChanged', () => {
    const payload = 3;
    jest.spyOn(component, 'inputChanged');
    component.setValue(payload);
    expect(component.inputChanged).toBeTruthy();
  });

  it('should handle focusOut', () => {
    const payload = '$3.00';
    jest.spyOn(component, 'focusOut');
    component.input.nativeElement.value = payload;
    expect(component.focusOut).toBeTruthy();
  });

  it('should handle setValue', () => {
    const res = component.setValue(2);
    expect(res).toBe(undefined);
  });
});
