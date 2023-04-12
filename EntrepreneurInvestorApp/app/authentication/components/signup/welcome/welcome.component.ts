import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WelcomeComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onClick(redirectTo) {
    let data = { redirectTo: redirectTo }
    this.dialogRef.close(data);
  }
  close() {
    this.dialogRef.close();
  }
}


export interface DialogData {
  userType: string;
}