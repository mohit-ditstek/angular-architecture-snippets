import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '@app/base';
import { ConfirmationDialogData, Term } from '@app/entities';
import { EventService, ModalService, RxjsService } from '@app/shared/services';
import { CustomConfirmationDialogComponent } from '@app/shared/ui';
 
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent extends BaseFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('form', { static: false }) public form: NgForm;
 
  @Input() terms: Term[];
  @Input() disabled: boolean;
  @Input() hasRatedGapProducts: boolean;
  @Input() isFinanceDealType: boolean;
 
  @Output() updatedTerms = new EventEmitter<Term[]>();
  @Output() autoSaveDisable = new EventEmitter<boolean>();
 
  previousTerm: number;
  index: number;
  initialTermChange = true;
  isValidationDialogOpened = false;
 
  constructor(public override eventService: EventService, public override rxjsService: RxjsService, private modalService: ModalService) {
    super(eventService, rxjsService);
  }
 
  ngAfterViewInit(): void {
    this.index = this.terms.findIndex((t) => t.isSelected);
    this.previousTerm = this.terms[this.index].term;
 
    this.registerFormValueChange();
  }
 
  public override formValuesChanged(): void {
    this.updatedTerms.emit(this.terms);
  }
 
  toggleRadio(index: number, isToggle = false) {
    if (this.hasTermChanged(index)) {
      this.openTermValidationDialog(index);
    } else {
      if(isToggle) this.updateTerms(index);
    }
  }
  hasTermChanged(index: number) {
    const selectedTerm = this.terms[index];
    const isChanged = selectedTerm.isSelected ? selectedTerm?.term !== this.previousTerm : false;
    return this.initialTermChange && isChanged && this.hasRatedGapProducts && !this.isValidationDialogOpened;
  }
 
  // Open term change validation prompt.
  private openTermValidationDialog(currentIndex: number) {
    this.isValidationDialogOpened = true;
    this.disableAutoSave(true);

    const modalData: ConfirmationDialogData = {
      title: 'deal.worksheet.financeTerms.termChanges',
      text: 'deal.worksheet.financeTerms.confirmations.changeLoanTerm',
      button: {
        primaryButton: 'common.cancel',
        secondaryButton: 'common.ok',
      }
    };
    if (this.index !== currentIndex) this.terms[this.index].isSelected = false;
 
    const dialogRef = this.modalService.open(CustomConfirmationDialogComponent, modalData, 'modal-sm');
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.updateTerms(currentIndex);
      } else {
        if (currentIndex == this.index) {
          this.terms[currentIndex] = { ...this.terms[currentIndex], term: this.previousTerm };
        } else {
          this.terms[this.index].isSelected = true;
          this.terms[currentIndex].isSelected = false;
        }
      }
      this.initialTermChange = false;
      this.disableAutoSave();
    });
  }
 
  private disableAutoSave(value = false) {
    this.autoSaveDisable.emit(value);
  }
  
  private updateTerms(index: number) {
    const updatedTerms = this.terms.map((term, i) => {
      const isSelected = i === index;
      return Object.assign({}, term, { isSelected });
    });
    this.terms = [...updatedTerms];
  }
 
  trackBy(index: number) {
    return index;
  }
 
  ngOnDestroy(): void {
    this.destroy();
  }
}
 