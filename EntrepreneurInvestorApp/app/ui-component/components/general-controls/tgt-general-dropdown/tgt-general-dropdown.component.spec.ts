import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtGeneralDropdownComponent } from './tgt-general-dropdown.component';

describe('TgtGeneralDropdownComponent', () => {
  let component: TgtGeneralDropdownComponent;
  let fixture: ComponentFixture<TgtGeneralDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtGeneralDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtGeneralDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
