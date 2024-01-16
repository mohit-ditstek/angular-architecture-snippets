import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@app/entities';

@Component({
  selector: 'app-custom-confirmation-dialog',
  templateUrl: './custom-confirmation-dialog.component.html',
  styleUrls: ['./custom-confirmation-dialog.component.scss']
})
export class CustomConfirmationDialogComponent  {

  constructor(public dialogRef: MatDialogRef<CustomConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {}

  close(value = false) {
    this.dialogRef.close(value);
  }
}
