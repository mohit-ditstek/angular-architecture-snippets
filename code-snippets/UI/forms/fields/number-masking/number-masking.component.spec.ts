import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NumberMaskingComponent } from './number-masking.component';

describe('NumberMaskingComponent', () => {
  let component: NumberMaskingComponent;
  let fixture: ComponentFixture<NumberMaskingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberMaskingComponent],
      imports: [FormsModule, NgxMaskModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberMaskingComponent);
    component = fixture.componentInstance;
    component.defaultMaskedFormat = 'X{25}';
    component.maskedFormat = 'X{25}';
    component.hiddenInput = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('focusIn Method is called', () => {
    const spy =jest.spyOn(component, 'focusIn');
    component.focusIn();
    expect(spy).toHaveBeenCalledWith();
  }); 
  
  it('focusOut Method is called', () => {
    jest.spyOn(component, 'focusOut');
    component.focusOut();
    expect(component.focusOut).toHaveBeenCalledWith();
  }); 
});
