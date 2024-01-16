import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputChipsComponent } from './input-chips.component';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

describe('InputChipsComponent', () => {
  let component: InputChipsComponent;
  let fixture: ComponentFixture<InputChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputChipsComponent],
      providers: [
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit value', () => {
    const data = 'data';
    // Example MatChipEditedEvent
    const event = { value: 'new value' } as MatChipEditedEvent;
    // Set initial value
    component.value = 'data', 'other value';
    component.valueChange.subscribe((newValue) => {
    // Check if valueChange emits correct value
      expect(newValue).toEqual(['new value', 'other value']);
    });
    // Call edit method
    component.edit(data, event);
  });

  it('should remove value if new value is empty', () => {
    const data = 'data';
    // Example MatChipEditedEvent with empty value
    const event = { value: '' } as MatChipEditedEvent; 
    // Set initial value
    component.value = 'data', 'other value'; 
    component.valueChange.subscribe((newValue) => {
      expect(newValue).toEqual(['other value']);
    });
    component.edit(data, event);
  });

  it('should add value and emit valueChange', () => {
    // Example MatChipInputEvent
    const event = { value: 'new value', chipInput: { clear: jest.fn() } } as unknown as MatChipInputEvent; 
    component.value = 'data';
    component.valueChange.subscribe((newValue) => {
      // Check if valueChange emits correct value
      expect(newValue).toEqual(['data', 'new value']); 
    });
    // Call add method
    component.add(event); 
    // Check if chipInput.clear() was called
    expect(event.chipInput!.clear).toHaveBeenCalled(); 
  });

  it('should remove value and emit valueChange', () => {
    // Set initial value
    component.value = 'data', 'other value'; 
    const valueToRemove = 'data';
    component.valueChange.subscribe((newValue) => {
      // Check if valueChange emits correct value
      expect(newValue).toEqual(['other value']); 
    });
    // Call remove method
    component.remove(valueToRemove); 
  });
});
