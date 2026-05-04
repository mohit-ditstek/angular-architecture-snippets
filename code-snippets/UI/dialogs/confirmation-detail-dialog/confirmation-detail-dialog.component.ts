import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationAction, ConfirmationDialogData } from '@app/entities';

@Component({
  selector: 'app-confirmation-detail-dialog',
  templateUrl: './confirmation-detail-dialog.component.html',
  styleUrls: ['./confirmation-detail-dialog.component.scss'],
})
export class ConfirmationDetailDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {}

  create() {
    this.close(ConfirmationAction.Create);
  }

  view() {
    this.close(ConfirmationAction.View);
  }

  cancel() {
    this.close(ConfirmationAction.Cancel);
  }

  close(action: ConfirmationAction) {
    this.dialogRef.close(action);
  }
}
