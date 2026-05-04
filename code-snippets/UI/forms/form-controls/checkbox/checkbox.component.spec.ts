import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { PipesModule } from '@app/shared/pipes';
import { MockUtilityService, UtilityService } from '@app/shared/services';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let utilityService: UtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [FormsModule, MatCheckboxModule, RouterTestingModule, PipesModule, MatTooltipModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: UtilityService,
          useValue: MockUtilityService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    utilityService = TestBed.inject(UtilityService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onChange Method is called', () => {
    const value = 12;
    const spy = jest.spyOn(utilityService, 'raiseCustomFieldChangeEvent');
    component.onChange(value);
    expect(spy).toHaveBeenCalled();
  });
});
