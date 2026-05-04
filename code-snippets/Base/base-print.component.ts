import { ElementRef } from '@angular/core';

export abstract class BasePrintComponent {
  abstract printButton: ElementRef;
  abstract close(): void;

  print() {
    setTimeout(() => {
      (this.printButton.nativeElement as HTMLElement).click();
      this.close();
    }, 1000);
  }
}
