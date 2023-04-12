import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentProfileSummaryComponent } from './investment-profile-summary.component';

describe('InvestmentProfileSummaryComponent', () => {
  let component: InvestmentProfileSummaryComponent;
  let fixture: ComponentFixture<InvestmentProfileSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentProfileSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentProfileSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
