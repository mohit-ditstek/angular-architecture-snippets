import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedInvestorComponent } from './recommended-investor.component';

describe('RecommendedInvestorComponent', () => {
  let component: RecommendedInvestorComponent;
  let fixture: ComponentFixture<RecommendedInvestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedInvestorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
