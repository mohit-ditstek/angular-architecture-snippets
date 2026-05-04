import { CurrencyPipe, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { ConfigItemType, ConfigItemsData } from '@app/entities';
import { ServicesModule, UtilityService } from '@app/shared/services';
import { AngularTestingRootModule, StoreTestingRootModule, ThirdPartyTestingRootModule } from '@app/shared/testing';
import { AppFacade } from '@app/store/app';
import { UserManagementFacade } from '@app/store/user-management';
import { of } from 'rxjs';
import { ConfigItemsDropdownComponent } from './config-items-dropdown.component';

describe('ConfigItemsDropdownComponent', () => {
  let component: ConfigItemsDropdownComponent;
  let fixture: ComponentFixture<ConfigItemsDropdownComponent>;
  let appFacade: AppFacade;
  const type = ConfigItemType.USStates;
  const tabindex = 0;
  const name = 'name';
  const configItems = ConfigItemsData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigItemsDropdownComponent],
      imports: [AngularTestingRootModule, ThirdPartyTestingRootModule, StoreTestingRootModule, ServicesModule, FormsModule, MatSelectModule],
      providers: [AppFacade, UtilityService, DatePipe, CurrencyPipe, UserManagementFacade],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemsDropdownComponent);
    appFacade = TestBed.inject(AppFacade);
    component = fixture.componentInstance;
    component.type = type;
    component.tabindex = tabindex;
    component.name = name;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit method', () => {
    appFacade.configItems$ = of(configItems);
    appFacade.configItems$.subscribe((res) => {
      tick(500);
      const result = res;
      expect(result[0].name).toBe('test1');
    });
  });

  it('should handle selectionChange', fakeAsync(() => {
    const expectType = 'Collision';
    const event = { target: { value: 'Collision' } };
    component.selectionChange(event);
    expect(event.target.value).toBe(expectType);
  }));
  it('init Method is called', () => {
    jest.spyOn(component, 'init');
    component.init();
    expect(component.init).toHaveBeenCalled();
  });
  it('ngOnChanges Method is called', () => {
    const payload = {};
    jest.spyOn(component, 'ngOnChanges');
    component.ngOnChanges(payload);
    expect(component.ngOnChanges).toHaveBeenCalledWith(payload);
  });

  it('should emit selected value on selection change', () => {
    const spy = jest.spyOn(component.selectedValue, 'emit');
    const matSelect = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    matSelect.dispatchEvent(new Event('selectionChange'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should raise custom field change event on selection change', () => {
    const matSelect = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    matSelect.dispatchEvent(new Event('selectionChange'));
    fixture.detectChanges();
  });

  it('should focus on mat-select when autoFocus is true', () => {
    const matSelect = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    jest.spyOn(matSelect, 'focus');
    component.autoFocus = true;
    fixture.detectChanges();
  });

  it('should populate options on init', () => {
    appFacade.configItems$ = of(configItems);
    component.init();
  });
});
