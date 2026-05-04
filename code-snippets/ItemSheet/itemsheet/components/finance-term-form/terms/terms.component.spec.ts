import { ComponentFixture, TestBed } from '@angular/core/testing';
 
import { TermsComponent } from './terms.component';
import { FormsModule } from '@angular/forms';
import { Term } from '@app/entities';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockDialogService, ModalService } from '@app/shared/services';
 
describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;
  const terms: Term[] = [
    {
      term: 1,
      interestRate: 10,
      isSelected: false,
      apr: 123,
      netPurchasePayment: 123,
      dailyPaymentAmount: 123,
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(),
    },
    {
      term: 2,
      interestRate: 20,
      isSelected: true,
      apr: 123,
      netPurchasePayment: 123,
      dailyPaymentAmount: 123,
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(),
    },
  ];
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsComponent],
      imports: [TranslateModule.forRoot({}), FormsModule],
      providers: [{ provide: ModalService, useValue: MockDialogService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });
 
  beforeEach(() => {
    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    component.terms = terms;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should check formValuesChanged method', () => {
    const mockEventMethod = jest.spyOn(component.updatedTerms, 'emit');
    component.initialTermChange = false;
    component.formValuesChanged();
    expect(mockEventMethod).toHaveBeenCalled();
    expect(mockEventMethod).toHaveBeenCalledWith(component.terms);
  });
 
  describe('should check toggleRadio method scenarios', () => {
    it('should check toggleRadio method', () => {
      terms[0].isSelected = false;
      terms[1].isSelected = true;
      component.previousTerm = 3;
      component.hasRatedGapProducts = true;
      component.initialTermChange = true;
      component.toggleRadio(1);
      expect(component.terms).toEqual(terms);
    });
    it('should check toggleRadio method handle else part', () => {
      terms[0].isSelected = false;
      terms[1].isSelected = true;
      component.previousTerm = 3;
      component.hasRatedGapProducts = true;
      component.initialTermChange = true;
      component.toggleRadio(1);
      expect(component.terms).toEqual(terms);
    });
    it('should check toggleRadio else part', () => {
      terms[1].isSelected = false;
 
      component.hasRatedGapProducts = false;
      component.toggleRadio(0, true);
      expect(component.terms.length).not.toBe(0);
    });
  });
});