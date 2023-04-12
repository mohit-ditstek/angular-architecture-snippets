import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedInvestorDetailsComponent } from './recommended-investor-details.component';

describe('RecommendedInvestorDetailsComponent', () => {
  let component: RecommendedInvestorDetailsComponent;
  let fixture: ComponentFixture<RecommendedInvestorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedInvestorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedInvestorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
