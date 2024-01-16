import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Signature } from '@app/entities';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent implements OnInit, OnChanges {
  signaturePad: SignaturePad;
  base64Data: string;

  @Input() name?: string;
  @Input() width: number;
  @Input() required = false;
  @Input() submitted = false;
  @Input() disabled = false;

  @Output() signatureBase64 = new EventEmitter<Signature>();

  @ViewChild('canvas', { static: true }) public canvas: ElementRef;
  @ViewChild('container', { static: true }) public container: ElementRef;

  ngOnChanges (changes: SimpleChanges) {
    if ('disabled' in changes) {
      const { currentValue, previousValue, firstChange } = changes['disabled'];
      if (!firstChange && currentValue !== previousValue) {
        if (!this.disabled) this.signaturePad.on();
      }
    }
  }
  ngOnInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    this.resizeCanvas();

    this.signaturePad.addEventListener('endStroke', () => {
      this.convertIntoBase64();
    });
    if (this.disabled) this.signaturePad.off();
  }
  

  convertIntoBase64() {
    this.base64Data = this.signaturePad.toDataURL('image/png');
    if (this.base64Data) this.signatureBase64.emit({ signatureBase64: this.base64Data });
  }

  clear() {
    this.signaturePad.clear();
    this.base64Data = null;
    this.signatureBase64.emit({ signatureBase64: this.base64Data });
  }

  resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.nativeElement.width = this.container.nativeElement.offsetWidth * ratio;
    this.canvas.nativeElement.height = this.container.nativeElement.offsetHeight * ratio;
    this.canvas.nativeElement.getContext('2d').scale(ratio, ratio);
  }
}
