import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { Utils } from 'src/app/core/util/utils';

@Component({
  selector: 'tgt-photo-uploader',
  templateUrl: './tgt-photo-uploader.component.html',
  styleUrls: ['./tgt-photo-uploader.component.scss']
})
export class TgtPhotoUploaderComponent implements OnInit {

  @Input() imageSrc: string
  @Input() errorMessage: string = "";
  @Input() fileMaxSize: number;
  @Output() onCropperLoad = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  localImageSrc: string
  showCropper = false;
  imageChangedEvent: any = '';
  selectedFile = null;
  selectedImage: any;

  constructor(public toasterService: ToasterService) { }

  ngOnInit() {
    this.localImageSrc = this.imageSrc || '../assets/images/default-avatar.jpeg'
  }

  fileChangeEvent(event: any): void {
    if (this.fileMaxSize > 0) {
      let convertIntoMb = Utils.convertBytesToMb(event.target.files[0].size);
      if (convertIntoMb <= this.fileMaxSize) {
        this.attachphotoToControl(event);
      } else {
        this.toasterService.showError(`Image size can't be more then ${this.fileMaxSize}MB`, 'Error!');
      }
    } else {
      this.attachphotoToControl(event);
    }
  }

  attachphotoToControl(event) {
    this.onCropperLoad.emit();
    this.imageChangedEvent = event;
    this.showCropper = true;
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.selectedImage = event.base64;
    this.selectedFile = this.base64ToFile(event.base64, 'file.png');
  }

  save() {
    this.localImageSrc = this.selectedImage
    this.onChange.emit(this.selectedFile)
    this.onClose.emit()
    this.showCropper = false;
  }

  cancel() {
    this.showCropper = false;
    this.onClose.emit()
  }

  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}


function convertBytesToMb() {
  throw new Error('Function not implemented.');
}

