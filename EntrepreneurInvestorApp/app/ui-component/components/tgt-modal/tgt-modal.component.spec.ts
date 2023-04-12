/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TgtModalComponent } from './tgt-modal.component';

describe('TgtModalComponent', () => {
  let component: TgtModalComponent;
  let fixture: ComponentFixture<TgtModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TgtModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
