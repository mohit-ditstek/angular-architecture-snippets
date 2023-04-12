import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentJourneySummaryComponent } from './investment-journey-summary.component';

describe('InvestmentJourneySummaryComponent', () => {
  let component: InvestmentJourneySummaryComponent;
  let fixture: ComponentFixture<InvestmentJourneySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentJourneySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentJourneySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
