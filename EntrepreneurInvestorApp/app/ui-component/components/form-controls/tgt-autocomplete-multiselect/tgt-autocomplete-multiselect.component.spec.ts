import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtAutocompleteMultiselectComponent } from './tgt-autocomplete-multiselect.component';

describe('TgtAutocompleteMultiselectComponent', () => {
  let component: TgtAutocompleteMultiselectComponent;
  let fixture: ComponentFixture<TgtAutocompleteMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtAutocompleteMultiselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtAutocompleteMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
