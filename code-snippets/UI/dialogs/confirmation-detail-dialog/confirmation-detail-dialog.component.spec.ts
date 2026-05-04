import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDetailDialogComponent } from './confirmation-detail-dialog.component';

describe('ConfirmationDetailDialogComponent', () => {
  let component: ConfirmationDetailDialogComponent;
  let fixture: ComponentFixture<ConfirmationDetailDialogComponent>;

  beforeEach(async () => {
    const dialogMock = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      close: () => {},
    };
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDetailDialogComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle Create method', () => {
    component.create();
    expect(component).toBeTruthy();
  });
  it('should handle View method', () => {
    component.view();
    expect(component).toBeTruthy();
  });
  it('should handle Cancel method', () => {
    component.cancel();
    expect(component).toBeTruthy();
  });
});
