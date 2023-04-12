import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedInvestorsListingComponent } from './recommended-investors-listing.component';

describe('RecommendedInvestorsListingComponent', () => {
  let component: RecommendedInvestorsListingComponent;
  let fixture: ComponentFixture<RecommendedInvestorsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedInvestorsListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedInvestorsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
