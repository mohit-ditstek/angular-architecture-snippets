import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtAutocompleteComponent } from './tgt-autocomplete.component';

describe('TgtAutocompleteComponent', () => {
  let component: TgtAutocompleteComponent;
  let fixture: ComponentFixture<TgtAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
