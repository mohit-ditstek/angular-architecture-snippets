import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ConfirmationDialogData,
  Option,
  Permission,
  RatedProduct,
  PurchaseUnit,
  WorksheetDetails,
  hasDuplicateProductSelected,
  SortDirection,
  Unit,
  UnitTypeOption,
} from '@app/entities';
import {
  ContractGenerationComponent,
  ContractGenerationValidationDialogComponent,
  DealerProductDialogComponent,
  DealerProductDialogData,
  RatingProductDialogComponent,
  RatingProductDialogData,
  RatingValidationsDialogComponent,
} from '@app/features/deals/deal-shared';

import { EventService, IdleService, ModalService, SnackbarService } from '@app/shared/services';
import { ConfirmationDialogComponent } from '@app/shared/ui';
import { DealFacade, DealOverview, DealTabPath, UnitsFacade, WorksheetFacade } from '@app/store/deal';
import { IntegrationManagementFacade } from '@app/store/integration-management';

import { PermissionService } from '@app/store/user';
import { BaseWorksheetPageComponent } from '../../base';
import { ProtectionProductGridComponent, ProtectionProductsButtonsComponent } from '../../components';

enum Action {
  ContractGenerateDialog = 'ContractGenerateDialog',
  OpenRatingDialog = 'OpenPresentDialog',
}

@Component({
  selector: 'app-protection-products',
  templateUrl: './protection-products.component.html',
  styleUrls: ['./protection-products.component.scss'],
})
export class ProtectionProductsComponent extends BaseWorksheetPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('protectionProductsGrid') override childComponents: QueryList<ProtectionProductGridComponent>;
  @ViewChild('productButtons') productButtons: ProtectionProductsButtonsComponent;

  readonly AvailablePermissions = Permission;
  readonly defaultSortColumn = 'productName';
  readonly defaultSortDirection = SortDirection.Ascending;

  worksheetDetails$ = this.worksheetFacade.workSheetDetails$;
  dealerCostToggle$ = this.worksheetFacade.dealerCostToggle$;
  protectionProductTaxAmount$ = this.worksheetFacade.protectionProductTaxAmount$;
  protectionProductTaxableAmount$ = this.worksheetFacade.protectionProductTaxableAmount$;
  worksheetDetails = new WorksheetDetails();
  unitsProducts: PurchaseUnit[] = [];

  units: Unit[] = [];

  unitOptions: Option[] = [];
  financeProducts: RatedProduct[] = [];
  unitTypes: UnitTypeOption[] = [];

  presentMode = false;
  dialogOpened = false;

  dealOverview: DealOverview;

  hasProtectionProvidersEnabled = false;

  actionPerformed?: Action;

  override skipDisabledCheck = true;

  showDealerCostToggle: boolean;

  public loading = false;

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    public override idleService: IdleService,
    public override eventService: EventService,
    public override worksheetFacade: WorksheetFacade,
    public override dealFacade: DealFacade,
    private modalService: ModalService,
    private snackbarService: SnackbarService,
    private unitsFacade: UnitsFacade,
    private integrationManagementFacade: IntegrationManagementFacade,
    public translateService: TranslateService
  ) {
    super(idleService, eventService, worksheetFacade, dealFacade);

    this.subscription.add(
      this.integrationManagementFacade.hasProtectionProvidersEnabled$.subscribe((value) => {
        this.hasProtectionProvidersEnabled = value;
      })
    );
  }

  ngOnInit(): void {
    this.showDealerCostToggle = this.permissionService.permissionIsGranted(Permission.ViewProductCostDeal);

    this.subscription.add(
      this.worksheetDetails$.subscribe((data) => {
        this.worksheetDetails = { ...data };
        const { units, products } = this.worksheetDetails;
        this.unitsProducts = units;
        this.financeProducts = products;
      })
    );

    this.subscription.add(
      this.dealFacade.dealOverview$.subscribe((res: DealOverview) => {
        this.dealOverview = res;
      })
    );

    this.subscription.add(
      this.unitsFacade.units$.subscribe((units) => {
        this.units = units;
        this.bindUnitOptions(units);
      })
    );

    this.subscription.add(
      this.worksheetFacade.showRatingDialog$.subscribe(({ present, ratingDialog }) => {
        if (ratingDialog && !this.dialogOpened) {
          this.dialogOpened = true;
          this.openDialog(present);
        }
      })
    );

    this.subscription.add(
      this.unitsFacade.openRatingDialog$.subscribe((open) => {
        if (open) this.openRateProductDialog();
      })
    );

    this.subscription.add(
      this.eventService.backgroundCallCompletedObservable$.subscribe(() => {
        if (this.actionPerformed) {
          this.performAction(this.actionPerformed);
          this.actionPerformed = null;
        }
      })
    );

    this.eventService.dealTypeChanged$.subscribe(() => {
      this.reloadProtectionProduct();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateFormStatus(), 100);
  }

  private bindUnitOptions(units: Unit[]) {
    this.unitOptions = units.map((u, i) => {
      return {
        text: `Unit ${i + 1}: ${u.year} ${u.make} ${u.model}`,
        value: u.unitId,
        isDisabled: false,
      };
    });
  }

  updateProtectionProducts(products: RatedProduct[], unitIndex = -1) {
    const hasDuplicateSelected = hasDuplicateProductSelected(products);
    const updatedProducts = products.map((p) => {
      const product = hasDuplicateSelected.find((dp) => dp.productId == p.productId);
      if (product && product?.productId == p.productId && !p.isSelected) {
        return Object.assign({}, p, { disable: true });
      }
      return Object.assign({}, p, { disable: false });
    });

    const payload = {
      products: updatedProducts,
      unitIndex: unitIndex,
    };
    this.changedProtectionProductForm(payload);
  }

  changedProtectionProductForm(data) {
    const payload = { ...data, isValid: this.isFormValid(), isDirty: this.isFormDirty() };
    this.worksheetFacade.updateProtectionProducts(payload);
  }

  calculateWorksheetDetails() {
    this.worksheetFacade.calculateWorksheetDetails(true);
  }

  resetProtectionProducts(){
    this.worksheetFacade.resetWorksheetChanges();
  }

  setActiveProductId(id) {
    this.worksheetFacade.setActiveProductId(id);
  }

  /*  Open Dialog with scenarios  */

  openDialog(present = false) {
    // Set Present Mode Flag
    this.presentMode = present;

    const isValid = this.isFormValid() || true;
    const isDirty = this.isFormDirty() || false;
    // Perform auto save if form is dirty and valid
    if (isValid && isDirty) {
      this.actionPerformed = Action.OpenRatingDialog;
      this.autoSave();
      return;
    }

    // Check if any provider is enabled
    if (!this.hasProtectionProvidersEnabled) {
      this.openNoProviderDialog();
      return;
    }

    let products: RatedProduct[] = [];
    this.unitsProducts.forEach((u) => (products = products.concat(u.products)));
    products = products.concat(this.financeProducts);

    // Reset Previous presentation berfore starting again
    const hasCustomerSelection = products.some((p) => p.isSelected || this.worksheetDetails.isPresentationCompleted);
    if (hasCustomerSelection) {
      this.openConfirmationDialog();
      return;
    }

    // If Present Mode Then
    if (this.presentMode) {
      this.router.navigateByUrl(`/deals/${this.dealOverview?.id}/menu`);
      return;
    }

    const ratedProducts = products.filter((p) => p.isRated);
    if (ratedProducts.length > 0) {
      // If Rating Mode Then
      this.openRateProductDialog();
    } else {
      // If no rated products then open rating dialog
      this.validateRating();
    }
  }

  /* Open Re-Rating/Re-Presentation confirmation dialog */

  private openConfirmationDialog() {
    // Message & Secondary button will be different before Contracts Generation & After Contracts Generation
    let messageTextKey;
    if (this.dealOverview.isContractsGenerated) {
      messageTextKey = this.presentMode ? 'rePresentationAfterContracts' : 'reRatingAfterContracts';
    } else {
      messageTextKey = this.presentMode ? 'rePresentationBeforeContracts' : 'reRatingBeforeContracts';
    }

    // Opening of Dialog with dyanmic message & button keys
    const data: ConfirmationDialogData = {
      title: `deal.worksheet.protectionProducts.${this.presentMode ? 'rePresentationTitle' : 'reRatingTitle'}`,
      text: `deal.worksheet.protectionProducts.confirmtionMessage.${messageTextKey}`,
      button: {
        primaryButton: 'deal.worksheet.protectionProducts.reRatingPrimaryButton',
        secondaryButton: 'deal.worksheet.protectionProducts.reRatingSecondaryButton',
      },
    };

    const dialogRef = this.modalService.open(ConfirmationDialogComponent, data, 'modal-sm');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.worksheetFacade.resetRatingProducts(true);
      }

      this.closeDialog();
    });
  }

  /* Validate Rating Method */
  private validateRating() {
    // check all units have selling price
    const { units } = this.worksheetDetails;
    const hasEmptySellingPrice = units.some((u) => !u.sellingPrice);
    if (hasEmptySellingPrice) {
      this.openSnackbar();
      return;
    }

    // Check rating required fields
    const data = {
      dealId: this.dealOverview.id,
      units: this.units,
    };

    const dialogRef = this.modalService.open(RatingValidationsDialogComponent, data, 'modal-llg');
    dialogRef.afterClosed().subscribe(({ result, units }) => {
      if (result) {
        if (units.length > 0) {
          this.unitsFacade.updateUnits(units);
        } else {
          this.openRateProductDialog();
        }
      }

      this.closeDialog();
    });
  }

  /* Rating Dialogs Methods */
  private openNoProviderDialog() {
    const data = {
      title: 'deal.worksheet.warningMessage.enableOrganizationeTitle',
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    const dialogRef = this.modalService.openDeleteDialog(ConfirmationDialogComponent, data, 'modal-sm', true);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigateByUrl('/settings/integrations');
      }
    });
  }

  private openRateProductDialog() {
    const { totalAmountFinanced, totalDealAmount, totalSelectedRatedProducts } = this.worksheetDetails;

    const totalAmtFinanced = totalAmountFinanced - totalSelectedRatedProducts;
    const totalDealAmt = totalDealAmount - totalSelectedRatedProducts;

    const data: RatingProductDialogData = {
      dealId: this.dealOverview.id,
      dealOverview: this.dealOverview,
      worksheetDetails: { ...this.worksheetDetails, totalAmountFinanced: totalAmtFinanced, totalDealAmount: totalDealAmt },
    };

    const dialogRef = this.modalService.open(RatingProductDialogComponent, data, 'modal-xl');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.worksheetFacade.getWorksheetDetails();
        this.dealFacade.lastUpdateDateTimeUpdate();
      }

      this.closeDialog();
    });
  }

  toggleDealerCost(show: boolean) {
    this.worksheetFacade.dealerCostToggle(show);
  }

  performAction(action: Action) {
    switch (action) {
    case Action.ContractGenerateDialog: {
      this.openGenerateContractValidationDialog();
      break;
    }

    case Action.OpenRatingDialog: {
      this.openDialog(this.presentMode);
      break;
    }

    default:
      return;
    }
  }

  detemineUnitName(unit) {
    return `${unit?.year} ${unit?.make} ${unit?.model}  (${unit?.vin})`;
  }

  openProductDialog(product?: RatedProduct, unitId?: number) {
    if (product?.isRated) {
      this.openDialog(false);
    } else {
      const dialogData: DealerProductDialogData = {
        product,
        unitId,
        unitOptions: this.unitOptions,
        worksheetDetails: this.worksheetDetails,
      };
      this.openDealerProductDialog(dialogData);
    }
  }
  private openDealerProductDialog(data: DealerProductDialogData) {
    const dialogRef = this.modalService.open(DealerProductDialogComponent, data, 'modal-md');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.worksheetFacade.getWorksheetDetails();
        this.dealFacade.lastUpdateDateTimeUpdate();
      }
    });
  }

  resetProducts() {
    const data: ConfirmationDialogData = {
      title: 'deal.worksheet.protectionProducts.resetProducts',
      titleReplacementObj: { value: this.translateService.instant('systemDefaults.tab') },
      button: {
        primaryButton: 'common.yes',
        secondaryButton: 'common.no',
      },
    };
    const dialogRef = this.modalService.open(ConfirmationDialogComponent, data, 'modal-sm');
    dialogRef.afterClosed().subscribe((result) => {
      if (result && !this.noProtectionProducts) {
        this.worksheetFacade.resetRatingProducts();
        // Perform Deal Tab Locks Logic
        this.worksheetFacade.updateTabLocks();
      }
    });
  }

  openGenerateContractValidationDialog() {
    const isValid = this.isFormValid();
    const isDirty = this.isFormDirty();
    if (isValid && isDirty) {
      this.actionPerformed = Action.ContractGenerateDialog;
      this.autoSave();
      return;
    }
    const dialogRef = this.modalService.open(ContractGenerationValidationDialogComponent, this.dealOverview.id, 'modal-llg');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openGenerateContractDialog();
      }
    });
  }

  openGenerateContractDialog() {
    const dialogRef = this.modalService.open(ContractGenerationComponent, this.dealOverview.id, 'modal-llg');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.redirectToDocs(this.dealOverview.id);
      }
    });
  }

  redirectToDocs(dealId) {
    this.router.navigate([`/deals/${dealId}/${DealTabPath.Docs}`], { queryParams: { refresh: true } });
  }

  private openSnackbar() {
    const message = 'deal.worksheet.warningMessage.requiredSellingPrice';
    this.snackbarService.warning(message);
  }

  private closeDialog() {
    this.dialogOpened = false;
    this.worksheetFacade.hideRateProduct(this.presentMode);
  }

  deleteProduct(isDeleted: boolean) {
    if (isDeleted) {
      this.autoSave();

      // Perform Deal Tab Locks Logic
      this.worksheetFacade.updateTabLocks();
    }
  }

  trackBy(_index: number, unit: PurchaseUnit) {
    return unit.id;
  }

  reloadProtectionProduct() {
    this.loading = true;
    setTimeout(() => (this.loading = false), 0);
  }

  get noProtectionProducts() {
    return this.unitsProducts.every((u) => u.products.length == 0) && this.financeProducts.length == 0;
  }

  get isPresentationCompleted() {
    return (
      this.unitsProducts.some((u) => u.products.some((p) => (!p.isSelectDisabled && p.isPresentationCompleted) || p.isSelected)) ||
      this.financeProducts.some((p) => p.isPresentationCompleted || p.isSelected)
    );
  }

  get isBlocked() {
    return this.dealOverview?.state === 'Blocked';
  }
  get isWorksheetTabLocked() {
    return this.dealOverview.isWorksheetLocked;
  }

  get isLocked() {
    return this.dealOverview.isLocked;
  }

  get isDealLocked() {
    const { isLocked, isCustomerLocked } = this.dealOverview;
    return isLocked || isCustomerLocked;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
