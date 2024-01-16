import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogData } from '@app/entities';
import { of } from 'rxjs';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';


describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<any, any>;
  const mockDialogRef = {
    close: jest.fn().mockImplementation(() => {
      return { afterClosed: () => of(false) };
    }),
  };


  const data: ConfirmationDialogData = {
    title: 'title',
    button: {
      primaryButton: 'Ok',
      secondaryButton: 'Cancel'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConfirmationDialogComponent ],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide : MatDialogRef, useValue : mockDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle close', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

});
