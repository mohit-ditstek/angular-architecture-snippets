import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThirdPartyTestingRootModule } from '@app/shared/testing';
import { MultiSelectComponent } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;
  const options = [{
    text: 'test',
    value: 1
  }]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ThirdPartyTestingRootModule, FormsModule, MatSelectModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    component.options = options;
    fixture.detectChanges();
  });

  it('should ...', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle toggleAllSelection', () => {
    it('should toggle has true', () => {
      const event = {checked: true};
      component.toggleAllSelection(event)
    });
    it('should toggle has false', () => {
      const event = {checked: false};
      component.toggleAllSelection(event)
    })
  });

  describe('should handle selectionChange', () => {
    it('should handle return with null value', () => {
      const event = null;
      component.selectionChange(event)
    });
    it('should handle emit section with value', () => {
      const mockSpyEvent = jest.spyOn(component.selection, 'emit');
      const event = {value: []};
      const filteredValue = event.value.filter(v => v);
      component.selectionChange(event);
      expect(component.value).toEqual(filteredValue);
      expect(mockSpyEvent).toHaveBeenCalledWith(filteredValue);
    })
  });

  describe('should check firstOption get property', () => {
    it('should check value has been null', () => {
      component.value = '';
      expect(component.firstOption).toBe(null);
    });
    it('should check has value', () => {
      component.value = '1';
      expect(component.firstOption).toEqual(undefined);
    })
  });
  describe('should check get property', () => {
    it('should check value has been true', () => {
      component.withWidth = true;
      expect(component.panelClass).toBe('multiSelectionWidth');
    });
    it('should check value has been false', () => {
      component.withWidth = false;
      expect(component.panelClass).toBe('multiSelection');
    })
  });
}) 