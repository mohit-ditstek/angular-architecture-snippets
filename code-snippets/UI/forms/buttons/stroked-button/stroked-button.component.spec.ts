import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StrokedButtonComponent } from './stroked-button.component';

describe('StrokedButtonComponent', () => {
  let component: StrokedButtonComponent;
  let fixture: ComponentFixture<StrokedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrokedButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTooltipModule, MatButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
