import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtRightNavComponent } from './tgt-right-nav.component';

describe('TgtRightNavComponent', () => {
  let component: TgtRightNavComponent;
  let fixture: ComponentFixture<TgtRightNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtRightNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtRightNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
