import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsMadeListingComponent } from './investments-made-listing.component';

describe('InvestmentsMadeListingComponent', () => {
  let component: InvestmentsMadeListingComponent;
  let fixture: ComponentFixture<InvestmentsMadeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentsMadeListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsMadeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
