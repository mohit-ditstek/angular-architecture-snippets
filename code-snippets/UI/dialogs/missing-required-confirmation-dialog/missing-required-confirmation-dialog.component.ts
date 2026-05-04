import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-missing-required-confirmation-dialog',
  templateUrl: './missing-required-confirmation-dialog.component.html',
  styleUrls: ['./missing-required-confirmation-dialog.component.scss'],
})
export class MissingRequiredConfirmationDialogComponent {
  public subject: Subject<boolean>;

  constructor(private dialogRef: MatDialogRef<MissingRequiredConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}

  onYesResponse() {
    if (this.subject) {
      this.subject.next(true);
      this.subject.complete();
    }
    this.close(true);
  }

  onNoResponse() {
    if (this.subject) {
      this.subject.next(false);
      this.subject.complete();
    }
    this.close(false);
  }

  close(result: boolean = false) {
    this.dialogRef.close(result);
  }

  get formIsDirty() {
    return this.data?.toUpperCase() == 'TRUE';
  }
}
