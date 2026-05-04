import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FinanceTermFormComponent } from './finance-term-form.component';
import { TermsComponent } from './terms/terms.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FinanceTermData, TermData } from '@app/store/deal';
import { MockDialogService, ModalService } from '@app/shared/services';
import { Term } from '@app/entities';

describe('FinanceTermFormComponent', () => {
  let component: FinanceTermFormComponent;
  let fixture: ComponentFixture<FinanceTermFormComponent>;
  const term: Term = {
    term: 60,
    interestRate: 4.5,
    apr: 0,
    isSelected: true,
    netPurchasePayment: 0,
    dailyPaymentAmount: 0,
    firstPaymentDate: new Date(),
    lastPaymentDate: new Date()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinanceTermFormComponent, TermsComponent],
      imports:[FormsModule,TranslateModule.forRoot({})],
      providers: [{provide: ModalService, useValue: MockDialogService}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTermFormComponent);
    component = fixture.componentInstance;
    component.financeTerm = {...component.financeTerm, terms: [term]}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deal type change', () => {
    const dealType = 'SomeDealType';
    const dealTypeChangedSpy = jest.spyOn(component.dealTypeChanged, 'emit');    
    component.dealTypeSelection(dealType);    
    expect(dealTypeChangedSpy).toHaveBeenCalledWith(dealType);
    expect(component.isFormDirty()).toBe(true);
  });

  it('should emit valuesChanged event with correct data', () => {
    const termsChanged = true;
    const isFormValidSpy = jest.spyOn(component, 'isFormValid').mockReturnValue(true);
    const isFormDirtySpy = jest.spyOn(component, 'isFormDirty').mockReturnValue(false);
    const emitSpy = jest.spyOn(component.valuesChanged, 'emit');
    component.financeTerm = FinanceTermData;
    component.formValuesChanged(termsChanged);
    expect(isFormValidSpy).toHaveBeenCalled();
    expect(isFormDirtySpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith({
      ...FinanceTermData,
      termsChanged,
      isValid: true,
      isDirty: false,
    });
  });

  it('should update financeTerm and call formValuesChanged', () => {
    const formValuesChangedSpy = jest.spyOn(component, 'formValuesChanged');
    component.updatedTerms(TermData);
    expect(component.financeTerm.terms).toEqual(TermData);
    expect(formValuesChangedSpy).toHaveBeenCalledWith(true);
  });

  describe('should check disable auto save method scenarios', () => {
    it('should check with disable true', ()=>{
      const mockEvent = jest.spyOn(component.autoSaveDisable, 'emit');
      component.disableAutoSave(true);
      expect(mockEvent).toHaveBeenCalledWith(true);
    });
    it('should check with disable false', ()=>{
      const mockEvent = jest.spyOn(component.autoSaveDisable, 'emit');
      component.disableAutoSave(false);
      expect(mockEvent).toHaveBeenCalledWith(false);
    });
  });
});
