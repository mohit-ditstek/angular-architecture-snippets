import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedCompaniesComponent } from './recommended-companies.component';

describe('RecommendedCompaniesComponent', () => {
  let component: RecommendedCompaniesComponent;
  let fixture: ComponentFixture<RecommendedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
