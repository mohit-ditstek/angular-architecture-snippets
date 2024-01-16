import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dirty-confirmation-dialog',
  templateUrl: './dirty-confirmation-dialog.component.html',
  styleUrls: ['./dirty-confirmation-dialog.component.scss'],
})
export class DirtyConfirmationDialogComponent {
  public subject: Subject<boolean>;

  constructor(private dialogRef: MatDialogRef<DirtyConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}

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
}
