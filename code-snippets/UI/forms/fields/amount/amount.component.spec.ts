import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { CustomMaxDirective, CustomMinDirective } from '../../validators';
import { AmountComponent } from './amount.component';

describe('AmountComponent', () => {
  let component: AmountComponent;
  let fixture: ComponentFixture<AmountComponent>;
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    await TestBed.configureTestingModule({
      declarations: [AmountComponent, CustomMaxDirective, CustomMinDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, NgxCurrencyModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountComponent);
    component = fixture.componentInstance;
    component.autoFocus = true;
    fixture.detectChanges();
  });

  it('should ...', () => {
    expect(component).toBeTruthy();
  });

  it('should handle onFocus method', () => {
    const event = { target: { select: jest.fn() } };
    component.onFocus(event);
    jest.advanceTimersByTime(0);
  });

});
