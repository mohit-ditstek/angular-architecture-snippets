import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { SaveButtonComponent } from './save-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventService, MockStorageService, StorageService } from '@app/shared/services';
import { StorageKeys } from '@app/shared/utils';

describe('SaveButtonComponent', () => {
  let component: SaveButtonComponent;
  let eventService: EventService;
  let storageService: StorageService;
  let fixture: ComponentFixture<SaveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot({}), MatButtonModule],
      providers: [
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
        { provide: StorageService, useValue: MockStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveButtonComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    storageService = TestBed.inject(StorageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle save function', () => {
    const mockEventMethod = jest.spyOn(eventService.saveObservable, 'next');
    component.isFormDirty = false;
    component.isFormValid = true;
    component.save();
    expect(mockEventMethod).toHaveBeenCalled();
  });

  it('should set isFormDirty correctly', () => {
    const value = true;
    const spy = jest.spyOn(storageService, 'set');
    component.isFormDirty = value;
    expect(spy).toHaveBeenCalledWith(StorageKeys.FormDirty, value, true);
    expect(component.isFormDirty).toBe(value);
  });
  it('should set isFormValid correctly', () => {
    const value = true;
    const spy = jest.spyOn(storageService, 'set');
    component.isFormValid = value;
    expect(spy).toHaveBeenCalledWith(StorageKeys.FormInvalid, !value, true);
    expect(component.isFormValid).toBe(value);
  });

  it('should reset session storage correctly', () => {
    const spy = jest.spyOn(storageService, 'remove');

    component.resetSessionStorage();

    expect(spy).toHaveBeenCalledWith(StorageKeys.FormInvalid, true);
    expect(spy).toHaveBeenCalledWith(StorageKeys.FormDirty, true);
  });

  it('should call save method when CTRL+S or CMD+S is pressed', () => {
    const mockEvent = {
      metaKey: true,
      ctrlKey: false,
      key: 's',
      preventDefault: jest.fn(),
    } as unknown as KeyboardEvent;

    const saveSpy = jest.spyOn(component, 'save');

    component.onKeyDown(mockEvent);

    expect(saveSpy).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle beforeunload event correctly', () => {
    const mockEvent = {
      returnValue: '',
      preventDefault: jest.fn(),
    } as unknown as Event;

    const hasLogoutProcessStartedSpy = jest.spyOn(eventService, 'hasLogoutProcessStarted').mockReturnValue(true);
    const setLogoutProcessSpy = jest.spyOn(eventService, 'setLogoutProcess');
    component.isFormDirty = true;

    component.beforeunloadHandler(mockEvent);

    expect(setLogoutProcessSpy).toHaveBeenCalledWith(false);
    hasLogoutProcessStartedSpy.mockRestore();
  });
});
