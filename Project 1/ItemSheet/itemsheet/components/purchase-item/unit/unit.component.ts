import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from '@app/base';
import { Address, ConfirmationDialogData, Option, PurchaseUnit, TaxJurisdiction, UnitFee } from '@app/entities';
import { VehicleTaxDialogComponent } from '@app/features/tax-profile/shared';
import { ItemizeDialogComponent } from '@app/shared/components';
import { EventService, ModalService, RxjsService, UtilityService } from '@app/shared/services';
import { ConfirmationDialogComponent } from '@app/shared/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent extends BaseFormComponent implements OnInit, AfterViewInit {
  @ViewChild('form', { static: false }) public form: NgForm;
  @Input() purchaseUnit: PurchaseUnit;
  @Input() disabled = false;
  @Input() hasCustomerAddress = false;
  @Input() address: Address;
  @Input() index: number;
  @Input() totalTaxableAmount$: Observable<number>;
  @Input() totalTaxAmount$: Observable<number>;
  @Input() unitTaxAmount$: Observable<number>;
  @Input() unitTaxableAmount$: Observable<number>;
  @Input() isContractGenerated = false;
  @Input() isCommonUseTaxes = false;
  @Input() activeTaxProfileOptions: Option[];

  @Output() purchaseUnitChanged = new EventEmitter<PurchaseUnit>();
  @Output() calculateWorksheetDetails = new EventEmitter<void>();
  @Output() resetUnit = new EventEmitter<number>();
  @Output() taxProfileChanged = new EventEmitter<number>();

  private skipFeesOverridePrompt = false;
  private skipLaborOverridePrompt = false;
  private skipAccessoriesOverridePrompt = false;
  private skipVehicleOverridePrompt = false;

  unitForm: PurchaseUnit;
  getCustomerRate: boolean;
  constructor(
    public override eventService: EventService,
    public override rxjsService: RxjsService,
    private modalService: ModalService,
    private router: Router,
    private utilityService: UtilityService
  ) {
    super(eventService, rxjsService);
  }

  ngOnInit(): void {
    this.unitForm = {
      ...this.purchaseUnit,
    };

    this.subscription.add(
      this.eventService.dialogSaveEventObservable$.subscribe((unit) => {
        this.purchaseUnitChanged.emit({ ...this.unitForm, ...unit });
      })
    );
  }

  ngAfterViewInit(): void {
    this.registerFormValueChange();
  }

  public override formValuesChanged(): void {
    const { taxes, products, isFreightTaxed, isPrepHandlingTaxed, isRebatesExcludedFromTax, taxProfileId } = this.purchaseUnit;
    this.purchaseUnitChanged.emit({
      ...this.unitForm,
      isFreightTaxed,
      isPrepHandlingTaxed,
      isRebatesExcludedFromTax,
      taxes,
      products,
      taxProfileId,
    });
  }

  toggleOverrideAccessories(checked: boolean) {
    if (this.skipAccessoriesOverridePrompt || !checked) {
      this.unitForm.overrideTotalInstalledPartsAccessories = checked;

      if (!checked) {
        const { totalInstalledPartsAccessoriesCalculated } = this.unitForm;
        this.unitForm.totalInstalledPartsAccessories = totalInstalledPartsAccessoriesCalculated;
      }

      this.markAsDirty();
      return;
    }

    this.skipAccessoriesOverridePrompt = true;
    if (this.unitForm.totalInstalledPartsAccessories > 0) {
      const dialogRef = this.prepareOverriddenPrompt('deal.worksheet.otherPayments.confirmationMessage.editAccessoryOption', 'Parts & Accessories');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.unitForm.overrideTotalInstalledPartsAccessories = result;
          this.markAsDirty();
        }
      });
    } else {
      this.unitForm.overrideTotalInstalledPartsAccessories = true;
      this.markAsDirty();
    }
  }

  toggleOverrideLabor(checked: boolean) {
    if (this.skipLaborOverridePrompt || !checked) {
      this.unitForm.overrideTotalLabor = checked;

      if (!checked) {
        const { totalLaborCalculated } = this.unitForm;
        this.unitForm.totalLabor = totalLaborCalculated;
      }

      this.markAsDirty();
      return;
    }

    this.skipLaborOverridePrompt = true;
    if (this.unitForm.totalLabor > 0) {
      const dialogRef = this.prepareOverriddenPrompt('deal.worksheet.otherPayments.confirmationMessage.editLabor', 'Labor');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.unitForm.overrideTotalLabor = result;
          this.markAsDirty();
        }
      });
    } else {
      this.unitForm.overrideTotalLabor = true;
      this.markAsDirty();
    }
  }

  toggleOverrideVehicleTax(checked: boolean) {
    if (this.skipVehicleOverridePrompt || !checked) {
      this.unitForm.isVehicleTaxOverridden = checked;

      if (!checked) this.handleVehicle();

      this.markAsDirty();
      return;
    }

    this.skipVehicleOverridePrompt = true;
    if (this.unitForm.vehicleTax > 0) {
      const dialogRef = this.prepareOverriddenPrompt('deal.worksheet.otherPayments.confirmationMessage.editOtherFeesOption', 'Vehicle Tax');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.unitForm.isVehicleTaxOverridden = result;
          this.markAsDirty();
        }
      });
    } else {
      this.unitForm.isVehicleTaxOverridden = true;
      this.markAsDirty();
    }
  }

  toggleOverrideFees(checked: boolean) {
    const taxes = this.unitForm.taxes;
    const showWarning = taxes.filter((component) => component.componentTypeLabel == 'Fee').some((tax) => tax.isTaxed);

    if (this.skipFeesOverridePrompt || !checked) {
      this.unitForm.isFeesOverridden = checked;

      if (!checked) {
        this.handleFees();
      } else {
        this.markAsDirty();
      }

      return;
    }
    this.skipFeesOverridePrompt = true;
    const msg = showWarning ? 'itemizeFeePrompt' : 'editOtherFeesOption';
    if (this.unitForm.totalFees > 0) {
      const dialogRef = this.prepareOverriddenPrompt(`deal.worksheet.otherPayments.confirmationMessage.${msg}`, 'Fees');
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.unitForm.isFeesOverridden = result;
          this.handleFees();
        }
      });
    } else {
      this.unitForm.isFeesOverridden = true;
      this.markAsDirty();
    }
  }

  openModifyTaxDialog() {
    const data = {
      customerAddress: this.address,
      unit: this.purchaseUnit,
      index: this.index,
      totalTaxableAmount$: this.totalTaxableAmount$,
      totalTaxAmount$: this.totalTaxAmount$,
      unitTaxableAmount$: this.unitTaxableAmount$,
      unitTaxAmount$: this.unitTaxAmount$,
      isCommonUseTaxes: this.isCommonUseTaxes,
      routeKey: 'deals',
      disabled: this.disabled,
    };
    const dialogRef = this.modalService.open(VehicleTaxDialogComponent, data, 'modal-xl');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calculateWorksheetDetails.emit();
      } else {
        this.resetUnit.emit(this.purchaseUnit.id);
      }
    });
  }

  toggleOverrideTax(checked: boolean) {
    if (this.skipFeesOverridePrompt || !checked) {
      this.unitForm.isVehicleTaxOverridden = checked;

      if (!checked) {
        this.handleFees();
      } else {
        this.markAsDirty();
      }

      return;
    }

    this.skipFeesOverridePrompt = true;

    const dialogRef = this.prepareOverriddenPrompt('deal.worksheet.otherPayments.confirmationMessage.editOtherFeesOption');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitForm.isVehicleTaxOverridden = result;
        this.handleFees();
      }
    });
  }

  openItemizeDialog() {
    const modalData = {
      itemizeFee: {
        fees: this.utilityService.deepCloneArray(this.unitForm.fees),
      },
      disabled: this.disabled,
    };

    const dialogRef = this.modalService.open(ItemizeDialogComponent, modalData, 'modal-md');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { fees } = result;
        const modifiedFees = this.utilityService.deepCloneArray(fees) as UnitFee[];
        this.unitForm = { ...this.unitForm, fees: modifiedFees };

        this.handleFees();
        this.formValuesChanged();
      }
    });
  }

  gotoCustomerAddressTab() {
    if (this.isContractGenerated && this.isTaxes) return;

    const dealId = this.router.url.split('/')[2];
    this.router.navigateByUrl(`deals/${dealId}/customers/address`);
  }

  private prepareOverriddenPrompt(title: string, value?: string) {
    const data: ConfirmationDialogData = {
      title: title,
      titleReplacementObj: { value },
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    return this.modalService.open(ConfirmationDialogComponent, data, 'modal-md');
  }

  private handleFees() {
    const { isFeesOverridden, totalFees, fees } = this.unitForm;
    const totalFeesAmount = isFeesOverridden ? totalFees : fees.reduce((sum, fee) => sum + fee.amount, 0);
    this.unitForm.totalFees = totalFeesAmount;
    this.markAsDirty();
  }

  private handleVehicle() {
    const { isVehicleTaxOverridden, vehicleTax, taxes } = this.unitForm;
    const totalTaxesAmount = isVehicleTaxOverridden ? vehicleTax : taxes?.reduce((sum, tax) => sum + tax.totalAmount, 0);
    this.unitForm.vehicleTax = totalTaxesAmount;
  }

  changeTaxProfile(id: number) {
    this.taxProfileChanged.emit(id);
  }

  get isCustomerAddress() {
    const isTaxJurisdictionOutOfState = this.purchaseUnit.taxes?.some((t) => t.jurisdictionType === TaxJurisdiction.Customer);
    return !this.hasCustomerAddress && isTaxJurisdictionOutOfState;
  }

  get isTaxes() {
    return (
      this.purchaseUnit?.taxes[0]?.rates.length === 0 &&
      this.isTaxJurisdictionOutOfState &&
      this.purchaseUnit?.taxes[0]?.isTaxed === true &&
      !this.purchaseUnit?.taxes[0]?.isSameAsUnit
    );
  }

  get isTaxJurisdictionOutOfState() {
    return this.purchaseUnit.isTaxJurisdictionOutOfState;
  }

  get isDisable() {
    return (
      !this.purchaseUnit.taxes?.length || !this.activeTaxProfileOptions?.length || (this.isContractGenerated && this.isTaxes) || this.unitForm.isVehicleTaxOverridden
    );
  }
}
