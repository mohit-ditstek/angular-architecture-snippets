import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissingRequiredConfirmationDialogComponent } from './missing-required-confirmation-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MockDialogService } from '@app/shared/services';

describe('MissingRequiredConfirmationDialogComponent', () => {
  let component: MissingRequiredConfirmationDialogComponent;
  let fixture: ComponentFixture<MissingRequiredConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<MissingRequiredConfirmationDialogComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MissingRequiredConfirmationDialogComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: MockDialogService },
        { provide: MAT_DIALOG_DATA, useValue: 'true' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MissingRequiredConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogRef = TestBed.inject(MatDialogRef);

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
  it('should handle formIsDirty action', () => {
    expect(component.formIsDirty).toBe(true);
  });
});
