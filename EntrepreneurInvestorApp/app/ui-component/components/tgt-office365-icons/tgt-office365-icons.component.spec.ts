import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TgtOffice365IconsComponent } from './tgt-office365-icons.component';

describe('TgtOffice365IconsComponent', () => {
  let component: TgtOffice365IconsComponent;
  let fixture: ComponentFixture<TgtOffice365IconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TgtOffice365IconsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TgtOffice365IconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
