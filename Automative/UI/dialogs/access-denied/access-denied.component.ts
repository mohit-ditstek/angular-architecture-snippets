import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent {
  constructor(public dialogRef: MatDialogRef<AccessDeniedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  close() {
    this.dialogRef.close(false);
  }
}
