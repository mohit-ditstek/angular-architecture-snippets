import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';
import { MatAccordionComponent } from './mat-accordion.component';
let panelOpenClosed;
describe('MatAccordionComponent', () => {
  let component: MatAccordionComponent;
  let fixture: ComponentFixture<MatAccordionComponent>;

  let mockMatExcepsionPanelHeader: any = {
    _toggle: jest.fn(),
  };
  beforeEach(async () => {
    panelOpenClosed = true;
    await TestBed.configureTestingModule({
      declarations: [MatAccordionComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAccordionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should render one mat-accordion', (done: Function) => {
    const compiled = fixture.debugElement.nativeElement;
    const hits = compiled.querySelectorAll('.mat-accordion');
    component.panelOpenClosed.emit(hits);
    expect(hits.length).toBe(1);
    done();
  });

  it('toggleAccordionPanel is called', () => {
    const compiled = fixture.debugElement.nativeElement;
    const hits = compiled.querySelectorAll('.mat-accordion');
    component.panelOpenClosed.emit(hits);
    expect(hits.length).toBe(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle toggle accordion panel', () => {
    component.matHeader = mockMatExcepsionPanelHeader;
    const spyMockEvent = jest.spyOn(component.panelOpenClosed, 'emit');

    component.toggleAccordionPanel();
    expect(spyMockEvent).toHaveBeenCalled();
  });

  it('toggleAccordionPanel Method is called', () => {
    const payload = 3;
    jest.spyOn(component, 'toggleAccordionPanel');
    component.toggleAccordionPanel();
    expect(component.toggleAccordionPanel).toHaveBeenCalled();
  });
});
