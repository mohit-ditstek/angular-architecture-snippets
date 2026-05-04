import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseFormComponent } from '@app/base';
import { ConfigItemType, DealType, FinanceTerm, Term} from '@app/entities';
import { EventService, RxjsService } from '@app/shared/services';
import { TermsComponent } from './terms/terms.component';

@Component({
  selector: 'app-finance-term-form',
  templateUrl: './finance-term-form.component.html',
  styleUrls: ['./finance-term-form.component.scss'],
})
export class FinanceTermFormComponent extends BaseFormComponent implements AfterViewInit {
  @ViewChild('form', { static: false }) public form: NgForm;
  @ViewChild('termsComponent', { static: false }) public termsComponent: TermsComponent;
 
  @Input() financeTerm = new FinanceTerm();
  @Input() firstPaymentDate: Date;
  @Input() lastPaymentDate: Date;
  @Input() disabled = false;
  @Input() isFinanceReservedAmountEnabled = false;
  @Input() financeReserveAmount : number;
  @Output() dealTypeChanged = new EventEmitter<DealType>();
  @Output() autoSaveDisable = new EventEmitter<boolean>();

  @Output() valuesChanged = new EventEmitter();
  public readonly TermFrequencyConfigItemType = ConfigItemType.TermFrequency;

  initialTermChange = true;
  constructor(
    public override eventService: EventService, 
    public override rxjsService: RxjsService, 
  ) {
    super(eventService, rxjsService);
  }

  ngAfterViewInit(): void {
    this.registerFormValueChange();
  }

  public override formValuesChanged(termsChanged = false): void {
    this.valuesChanged.emit({ ...this.financeTerm, termsChanged, isValid: this.isFormValid(), isDirty: this.isFormDirty() });
  }

  updatedTerms(terms: Term[]) {
    this.financeTerm = { ...this.financeTerm, terms };
    this.formValuesChanged(true);
  }

  dealTypeSelection(dealType) {
    this.dealTypeChanged.emit(dealType);
    this.markAsDirty();
  }

  disableAutoSave(disable: boolean) {
    this.autoSaveDisable.emit(disable);
  }

  override isFormValid() {
    return this.form ? this.form.valid && (this.termsComponent?.isFormValid() ?? true) : true;
  }

  override isFormDirty() {
    return this.form.dirty || (this.termsComponent?.isFormDirty() ?? false);
  }

  get isFinanceDealType() {
    return this.financeTerm?.dealType === DealType.Finance;
  }
}
