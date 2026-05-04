import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirtyConfirmationDialogComponent } from './dirty-confirmation-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockDialogService } from '@app/shared/services';
import { TranslateModule } from '@ngx-translate/core';

describe('DirtyConfirmationDialogComponent', () => {
  let component: DirtyConfirmationDialogComponent;
  let fixture: ComponentFixture<DirtyConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<DirtyConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirtyConfirmationDialogComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        {provide: MatDialogRef, useValue: MockDialogService},
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirtyConfirmationDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle close with dialogRef', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.onYesResponse();
    expect(spy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
  it('should handle close with dialogRef', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.onNoResponse();
    expect(spy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
  it('should handle close with dialogRef', () => {
    const spy = jest.spyOn(dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  }); 
});
