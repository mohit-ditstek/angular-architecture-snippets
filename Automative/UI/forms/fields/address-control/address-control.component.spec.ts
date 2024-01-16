import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { AddressControlComponent } from './address-control.component';

describe('AddressControlComponent', () => {
  let component: AddressControlComponent;
  let fixture: ComponentFixture<AddressControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressControlComponent],
      imports: [StoreModule.forRoot({}), FormsModule],
      providers: [
        {
          provide: AppFacade,
          useValue: MockAppFacade,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
