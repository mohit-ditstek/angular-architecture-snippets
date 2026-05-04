import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogData } from '@app/entities';
import { of } from 'rxjs';

import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog.component';

describe('CustomConfirmationDialogComponent', () => {
  let component: CustomConfirmationDialogComponent;
  let fixture: ComponentFixture<CustomConfirmationDialogComponent>;
  const mockDialogRef = {
    close: jest.fn().mockImplementation(() => {
      return { afterClosed: () => of(false) };
    }),
  };
  let dialogRef: MatDialogRef<any, any>;
  const dialogMock = {
    close: () => { }
};

  const data: ConfirmationDialogData = {
    title: 'title',
    button: {
      primaryButton: 'Ok',
      secondaryButton: 'Cancel',
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomConfirmationDialogComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.data = data;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle close', ()=> {
    jest.spyOn(dialogMock, 'close').mockImplementation();
    component.close();
    expect(dialogMock.close).toHaveBeenCalledWith(false);
  });
});
