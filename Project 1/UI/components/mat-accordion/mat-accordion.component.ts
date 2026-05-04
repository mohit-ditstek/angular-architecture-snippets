import { ViewChild } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatExpansionPanelHeader } from '@angular/material/expansion';

@Component({
  selector: 'app-mat-accordion',
  templateUrl: './mat-accordion.component.html',
  styleUrls: ['./mat-accordion.component.scss']
})
export class MatAccordionComponent {

  @ViewChild('panelH') matHeader: MatExpansionPanelHeader;

  @Input() title: string;
  @Input() isExpanded = true;
  @Input() simpleMode = true;
  @Input() upperBorder = false;
  @Input() bordered = false;
  @Input() accordionClass: string;

  @Output() panelOpenClosed = new EventEmitter<boolean>();

  constructor() { }

  toggleAccordionPanel() {
    this.matHeader._toggle();
    this.panelOpenClosed.emit(!this.isExpanded);
    
  }
  

}
