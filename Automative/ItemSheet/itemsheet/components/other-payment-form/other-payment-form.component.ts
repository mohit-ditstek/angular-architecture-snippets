import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from '@app/base';
import { Address, ConfirmationDialogData, OtherPayments, TaxJurisdiction } from '@app/entities';
import { EventService, ModalService, RxjsService } from '@app/shared/services';
import { ConfirmationDialogComponent } from '@app/shared/ui';
import { DepositItemizeDialogComponent, TaxConfigDialogComponent } from '@app/features/tax-profile/shared';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-other-payment-form',
  templateUrl: './other-payment-form.component.html',
  styleUrls: ['./other-payment-form.component.scss'],
})
export class OtherPaymentFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('form', { static: false }) public form: NgForm;

  @Input() details: OtherPayments;
  @Input() disabled = false;
  @Input() totalUnitPrice: number;
  @Input() hasCustomerAddress = false;
  @Input() isContractGenerated = false;
  @Input() address: Address;
  @Input() taxableAmount$: Observable<number>;
  @Input() taxAmount$: Observable<number>;

  @Output() valuesChanged = new EventEmitter();
  @Output() calculateWorksheetDetails = new EventEmitter<void>();
  @Output() resetUnInstalledParts = new EventEmitter<void>();
  @Output() saveDetails = new EventEmitter<void>();

  paymentForm = new OtherPayments();

  showAmountChangePopup = true;
  actionPerformed: boolean;
  showSaleTaxAmountChangePopup = true;
  constructor(public override eventService: EventService, public override rxjsService: RxjsService, private modalService: ModalService, private router: Router) {
    super(eventService, rxjsService);
  }

  ngOnInit(): void {
    if (this.details) {
      this.paymentForm = { ...this.paymentForm, ...this.details };
    }

    this.subscription.add(
      this.eventService.backgroundCallCompletedObservable$.subscribe(() => {
        if (this.actionPerformed) {
          this.openModifyTaxDialog();
          this.actionPerformed = false;
        }
      })
    );

    this.subscription.add(
      this.eventService.dialogSaveEventObservable$.subscribe((paymentDetails) => {
        const taxes = this.paymentForm.taxes.map((tax) => {
          if (tax.componentTypeLabel == paymentDetails.tax.componentTypeLabel) return paymentDetails.tax;
          return tax;
        });
        this.valuesChanged.emit({ ...this.paymentForm, taxes, deposits: this.details.deposits, totalCashDown: this.paymentForm.totalDownPayment});
      })
    );
  }

  ngAfterViewInit(): void {
    this.registerFormValueChange();
  }

  public override formValuesChanged(): void {
    this.valuesChanged.emit({ ...this.paymentForm, taxes: this.details.taxes, deposits: this.details.deposits, totalCashDown: this.paymentForm.totalDownPayment});
  }

  toggleAccessoryAmountField(checked: boolean) {
    this.markAsDirty();
    if (!checked) {
      this.handlePartsAccessories(checked);
      return;
    }

    const data: ConfirmationDialogData = {
      title: 'deal.worksheet.otherPayments.confirmationMessage.itemizeUnInstallAccessories',
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    if (this.paymentForm.totalNonInstalledPartsAccessoriesLabor > 0) {
      const dialogRef = this.modalService.open(ConfirmationDialogComponent, data, 'modal-md');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.handlePartsAccessories(result);
        }
      });
    }else{
      this.handlePartsAccessories(true);
      this.markAsDirty();
    }
  }

  toggleSalesTax(checked: boolean) {
    this.markAsDirty();
    if (!checked) {
      this.handleSalesTax(checked);
      return;
    }

    const data: ConfirmationDialogData = {
      title: 'deal.worksheet.otherPayments.confirmationMessage.editOtherFeesOption',
      titleReplacementObj: { value: 'Sales/Other Taxes' },
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    if (this.showSaleTaxAmountChangePopup && this.paymentForm.salesOtherTax > 0) {
      this.showSaleTaxAmountChangePopup = false;
      const dialogRef = this.modalService.open(ConfirmationDialogComponent, data, 'modal-md');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.handleSalesTax(result);
        }
      });
    }else{
      this.handleSalesTax(true);
      this.markAsDirty();
    }
  }

  toggleTotalDownPayment(checked: boolean) {      
    this.markAsDirty();
    if (!checked) {
      this.handleTotalDownPayment(checked);
      return;
    }

    const data: ConfirmationDialogData = {
      title: 'deal.worksheet.otherPayments.confirmationMessage.editOtherFeesOption',
      titleReplacementObj: { value: 'Deposit/Down Payment' },
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    if (this.showAmountChangePopup && this.paymentForm.totalDownPayment > 0) {
      this.showAmountChangePopup = false;
      const dialogRef = this.modalService.open(ConfirmationDialogComponent, data, 'modal-md');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.handleTotalDownPayment(result);
        }
      });
    }
    else {
      this.handleTotalDownPayment(true);
      this.markAsDirty();
    }
  }

  performAction() {
    if (this.isContractGenerated && this.isTaxes) return;

    if (this.isCustomerAddress) this.gotoCustomerAddressTab();
    else this.openModifyTaxDialog();
  }

  gotoCustomerAddressTab() {
    const dealId = this.router.url.split('/')[2];
    this.router.navigateByUrl(`deals/${dealId}/customers/address`);
  }
   
  openModifyTaxDialog() {
    const isDirty = this.isFormDirty();
    const isValid = this.isFormValid();
    if (isDirty && isValid) {
      this.actionPerformed = true;
      this.saveDetails.emit();
      return;
    }
    const nonInstalledTaxes = this.details.taxes?.find((t) => t.componentTypeLabel === 'NonInstalledPartsAccessories');
    nonInstalledTaxes['componentAmount'] = this.details?.totalNonInstalledPartsAccessoriesLabor;
    const data = {
      title: 'common.taxes.salesOtherTaxes',
      salesOtherTaxes: nonInstalledTaxes,
      customerAddress: this.address,
      taxAmount$: this.taxAmount$,
      taxableAmount$: this.taxableAmount$,
      effectiveTaxRate: 'deal.worksheet.tax.salesOtherTax.effectiveTaxRate',
      salesTaxAmount: 'deal.worksheet.tax.salesOtherTax.salesTaxAmount',
      routeKey: 'deals',
      disabled: this.disabled,
      isCommonUseTaxes: this.details.isCommonUseTaxes
    };
    const dialogRef = this.modalService.open(TaxConfigDialogComponent, data, 'modal-lg');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calculateWorksheetDetails.emit();
      } else {
        this.resetUnInstalledParts.emit();
      }
    });
  }

  openDepositDialog() {
    const payload = {
      data: [...this.details.deposits],
      disabled: this.disabled,
    };
    const dialogRef = this.modalService.open(DepositItemizeDialogComponent, payload, 'modal-lg');
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.valuesChanged.emit({ ...this.details, deposits: [...data] });
        this.calculateWorksheetDetails.emit();
      }
    });
  }

  private handleSalesTax(checked: boolean) {
    this.paymentForm.isSalesOtherTaxOverridden = checked;
    const { isSalesOtherTaxOverridden, salesOtherTax } = this.paymentForm;
    const totalSalesTaxAmount = this.details.taxes.reduce((sum, tax) => sum + tax.totalAmount, 0);

    const changed = salesOtherTax != totalSalesTaxAmount;
    if (changed) {
      this.paymentForm.salesOtherTax = isSalesOtherTaxOverridden ? salesOtherTax : totalSalesTaxAmount;
      this.markAsDirty();
    }
  }

  private handlePartsAccessories(checked: boolean) {
    const { totalNonInstalledPartsAccessoriesLabor, totalNonInstalledPartsAccessoriesLaborCalculated } = this.paymentForm;
    this.paymentForm.overrideTotalNonInstalledPartsAccessoriesLabor = checked;

    const changed = totalNonInstalledPartsAccessoriesLabor != totalNonInstalledPartsAccessoriesLaborCalculated;
    if (changed) {
      this.paymentForm.totalNonInstalledPartsAccessoriesLabor = totalNonInstalledPartsAccessoriesLaborCalculated;
      this.markAsDirty();
    }
  }

  private handleTotalDownPayment(checked: boolean) {
    this.paymentForm.isTotalCashDownOverridden = checked;
  }

  get isCustomerAddress() {
    return !this.hasCustomerAddress && this.details.isTaxJurisdictionOutOfState;
  }

  get isTaxes() {
    return (
      this.details.taxes[0]?.rates.length === 0 &&
      this.details.taxes[0]?.jurisdictionType === TaxJurisdiction.Customer &&
      this.details.taxes[0]?.isTaxed === true &&
      !this.details.taxes[0]?.isSameAsUnit
    );
  }

  get isWarningMessage() {
    return this.isCustomerAddress || this.isTaxes;
  }

  get warningMessages() {
    if (this.isCustomerAddress) return 'common.missingCustomerAddress';

    return 'common.missingCustomerTaxes';
  }

  get isDisable() {
    return this.details.taxes?.length === 0 || (this.isContractGenerated && this.isTaxes) || this.paymentForm.isSalesOtherTaxOverridden;
  }

  ngOnDestroy(): void { 
    this.destroy();
  }
}
