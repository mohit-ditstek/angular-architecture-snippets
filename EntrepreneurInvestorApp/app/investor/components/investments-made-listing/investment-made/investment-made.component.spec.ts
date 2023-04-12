import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentMadeComponent } from './investment-made.component';

describe('InvestmentMadeComponent', () => {
  let component: InvestmentMadeComponent;
  let fixture: ComponentFixture<InvestmentMadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentMadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentMadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
