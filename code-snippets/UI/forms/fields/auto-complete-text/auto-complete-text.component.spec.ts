import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StoreModule } from '@ngrx/store';
import { MockUtilityService, UtilityService } from '@app/shared/services';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { MockUserFacade, UserFacade } from '@app/store/user';
import { of } from 'rxjs';
import { AutoCompleteTextComponent } from './auto-complete-text.component';

describe('AutoCompleteTextComponent', () => {
  let component: AutoCompleteTextComponent;
  let fixture: ComponentFixture<AutoCompleteTextComponent>;
  let utilityService: UtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoCompleteTextComponent],
      imports: [FormsModule, StoreModule.forRoot({}), MatAutocompleteModule, StoreModule.forFeature('app', {})],
      providers: [
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
        {
          provide: UserFacade,
          useValue: MockUserFacade,
        },
        {
          provide: UtilityService,
          useValue: MockUtilityService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteTextComponent);
    component = fixture.componentInstance;
    utilityService = TestBed.inject(UtilityService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from autoCompleteSubscription on ngOnDestroy', () => {
    component.autoCompleteSubscription = of().subscribe();
    const unsubscribeSpy = jest.spyOn(component.autoCompleteSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

   
  it('should check preventSpace', () => {
    const spy = jest.spyOn(utilityService, 'preventSpace');
    component.preventSpace(event);
    expect(spy).toHaveBeenCalled();
  });

  describe('should handle onFocus', () => {
    it('should check valueChanges', fakeAsync(() => {
      component.value = 'test';
      fixture.detectChanges();
      component.onFocus();
      tick(300);
    }));

    it('should check value is null on valueChanges', fakeAsync(() => {
      component.value = '';
      fixture.detectChanges();
      component.onFocus();
      tick(300);
    }));
  });

  it('should check onAutoCompleteSelect', () => {
    const payload = {
      option: {
        value: 'test',
      },
    } as MatAutocompleteSelectedEvent;

    const spy = jest.spyOn(component.selectedFieldsId, 'emit');
    component.onAutoCompleteSelect(payload);
    expect(spy).toHaveBeenCalled();
  });
});
