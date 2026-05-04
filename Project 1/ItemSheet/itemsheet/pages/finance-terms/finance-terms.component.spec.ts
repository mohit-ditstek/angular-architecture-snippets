import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DealType } from '@app/entities';
import { PipesModule } from '@app/shared/pipes';
import { MockUtilityService, UtilityService } from '@app/shared/services';
import { MockRouterService } from '@app/shared/testing';
import { DealFacade, FinanceTermData, MockDealFacade, WorksheetFacade } from '@app/store/deal';
import { FinanceTermsComponent } from './finance-terms.component';
import { FeatureFlagsService, MockFeatureFlagsService } from '@app/base';

describe('FinanceTermsComponent', () => {
  let component: FinanceTermsComponent;
  let fixture: ComponentFixture<FinanceTermsComponent>;
  let worksheetFacade: WorksheetFacade;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinanceTermsComponent],
      imports: [StoreModule.forRoot({}), PipesModule, TranslateModule.forRoot({}), FormsModule, RouterTestingModule, StoreModule.forFeature('deal', {})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DealFacade, useValue: MockDealFacade },
        { provide: UtilityService, useValue: MockUtilityService },
        WorksheetFacade,
        {
          provide: Router,
          useValue: MockRouterService,
        },
        { provide: FeatureFlagsService, useValue: MockFeatureFlagsService },

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    worksheetFacade = TestBed.inject(WorksheetFacade);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check valueChanged method ', () => {
    expect(component).toBeTruthy();
  });

  it('should update deal type and navigate if dealType is Cash', () => {
    const spyOnUpdate = jest.spyOn(worksheetFacade, 'updateDealType');
    const spyOnRoute = jest.spyOn(router, 'navigateByUrl');
    const dealType = DealType.Cash;
    component.dealTypeChanged(dealType);
    expect(spyOnUpdate).toHaveBeenCalledWith({
      dealType,
      isValid: true,
      isDirty: false,
    });
    expect(spyOnRoute).toHaveBeenCalledWith('https://onedealerlane.com');
  });

  it('should update finance terms', () => {
    const spyOnUpdate = jest.spyOn(worksheetFacade, 'updateFinanceTerms');
    component.valueChanged(FinanceTermData);
    expect(spyOnUpdate).toHaveBeenCalledWith(FinanceTermData);
  });
  describe('should check disable auto save method scenarios', () => {
    it('should check with disable true', ()=>{
      component.disableAutoSave(true);
      expect(component.autoSaveDisable).toBe(true);
    });
    it('should check with disable false', ()=>{
      component.disableAutoSave(false);
      expect(component.autoSaveDisable).toBe(false);
    });
  });
});
