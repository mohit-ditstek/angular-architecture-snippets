import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss'],
})
export class BaseDialogComponent {
  @Input() title: string;
  @Input() contentClass = '';
  @Input() closeIcon = true;
  @Input() hideBody = false;
  @Input() hideHeader = false;
  @Output() dialogClose = new EventEmitter();

  closeDialog() {
    this.dialogClose.emit();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.closeDialog();
  }
}
