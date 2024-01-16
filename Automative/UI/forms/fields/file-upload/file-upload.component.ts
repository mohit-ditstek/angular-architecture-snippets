import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UtilityService } from '@app/shared/services';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {

  @ViewChild('file') file: ElementRef;
  @Input() accept = '/*';
  @Input() allowedTypes: string[];
  @Input() label: string;
  @Input() name: string;
  @Input() required = false;
  @Input() buttonName: string;
  @Input() currentImage: string;
  @Input() maxFileSize = 100;
  @Input() disableControl = false;

  @Output() uploadFile = new EventEmitter<string>();

  isImageType: boolean;
  showError = false;
  showMaxSizeError = false;
  hideError = false;
  fileName = '';
  readonly imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

  constructor(public utilityService: UtilityService) { }
  ngOnInit() {
    this.isImageType = this.allowedTypes?.some(type => this.imageTypes.includes(type));
  }

  onFileChange(event) {
    const file = event.target.files[0];
    const fileSize = this.utilityService.validateMaxSizeInKb(file?.size, this.maxFileSize);
    if (fileSize) {
      this.showMaxSizeError = false;
      this.convertFileIntoBase64(file);
    } else {
      this.showMaxSizeError = true;
      this.showError = false;
    }
  }

  convertFileIntoBase64(file) {
    if (!file) return;
    this.showError = false;

    const split = file.name.split('.');
    const fileType = split[split.length - 1]?.toLowerCase();
    const isNotValidImageType = !this.allowedTypes.includes(fileType);
    if (isNotValidImageType) {
      this.showError = true;
      return;
    }


    this.fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64textString = (reader.result).toString();
      this.currentImage = base64textString;
      this.uploadFile.emit(base64textString);
    };
  }

  removeLogo() {
    if(this.disableControl) return;

    this.currentImage = 'assets/core/images/no-image.png';
    this.uploadFile.emit('');
    this.file.nativeElement.value = '';
    this.fileName = '';
    this.showError = false;
    this.showMaxSizeError = false;
  }

  get mimeType() {
    return this.isImageType ? 'image/' : 'application/';
  }
}
