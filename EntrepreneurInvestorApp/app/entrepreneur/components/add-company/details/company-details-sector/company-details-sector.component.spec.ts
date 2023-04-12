import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsSectorComponent } from './company-details-sector.component';

describe('PersonalDetailsComponent', () => {
  let component: CompanyDetailsSectorComponent;
  let fixture: ComponentFixture<CompanyDetailsSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDetailsSectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
