import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtYearPickerComponent } from './tgt-year-picker.component';

describe('TgtYearPickerComponent', () => {
  let component: TgtYearPickerComponent;
  let fixture: ComponentFixture<TgtYearPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtYearPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtYearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
