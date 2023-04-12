import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtWidgetComponent } from './tgt-widget.component';

describe('TgtWidgetComponent', () => {
  let component: TgtWidgetComponent;
  let fixture: ComponentFixture<TgtWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
