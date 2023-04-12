import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtPageLoaderComponent } from './tgt-page-loader.component';

describe('TgtPageLoaderComponent', () => {
  let component: TgtPageLoaderComponent;
  let fixture: ComponentFixture<TgtPageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtPageLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
