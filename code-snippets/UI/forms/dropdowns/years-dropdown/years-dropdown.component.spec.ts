import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '@app/shared/pipes';
import { ServicesModule, UtilityService } from '@app/shared/services';

import { YearsDropdownComponent } from './years-dropdown.component';

describe('YearsDropdownComponent', () => {
  let component: YearsDropdownComponent;
  let fixture: ComponentFixture<YearsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearsDropdownComponent],
      imports: [BrowserAnimationsModule, FormsModule, MatSelectModule, RouterTestingModule, PipesModule, ServicesModule],
      providers: [UtilityService, DatePipe, CurrencyPipe, DecimalPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsDropdownComponent);
    component = fixture.componentInstance;
    component.options = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check on select change method', () => {
    // trigger the click
    component.selectionChange(true);
  });
});
