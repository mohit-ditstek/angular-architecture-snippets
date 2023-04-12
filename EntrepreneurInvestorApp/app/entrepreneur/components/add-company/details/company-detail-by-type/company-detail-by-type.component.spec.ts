import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailByTypeComponent } from './company-detail-by-type.component';

describe('CompanyDetailByTypeComponent', () => {
  let component: CompanyDetailByTypeComponent;
  let fixture: ComponentFixture<CompanyDetailByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDetailByTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
