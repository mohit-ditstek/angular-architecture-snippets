import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdPartyTestingRootModule } from '@app/shared/testing';
import { AccessDeniedComponent } from './access-denied.component';
import { MockDialogService } from '@app/shared/services';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;
  let dialogRef: MatDialogRef<AccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessDeniedComponent],
      imports: [ThirdPartyTestingRootModule],
      providers: [
        { provide: MatDialogRef, useValue: MockDialogService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogRef = TestBed.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(dialogRef).toBeTruthy();
  });
  it('close function is called', () => {
    jest.spyOn(component, 'close');
    component.close();
    expect(component.close).toHaveBeenCalled();
  });
});
