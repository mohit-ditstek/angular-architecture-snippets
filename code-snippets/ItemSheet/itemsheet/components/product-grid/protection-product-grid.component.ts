import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { BaseFormComponent } from '@app/base';
import { Address, ComponentTax, GridColumn, NoSurchargeApplyId, RatedProduct, SortDirection, TaxJurisdiction, WorksheetDetails } from '@app/entities';
import { TaxConfigDialogComponent } from '@app/features/tax-profile/shared';

import { DeductiblePipe, MileagePipe, TermPipe } from '@app/shared/pipes';
import { EventService, ModalService, RxjsService, UtilityService } from '@app/shared/services';
import { DeleteConfirmationDialogComponent, MatGridComponent } from '@app/shared/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-protection-product-grid',
  templateUrl: './protection-product-grid.component.html',
  styleUrls: ['./protection-product-grid.component.scss'],
  providers: [TermPipe, MileagePipe, DeductiblePipe],
})
export class ProtectionProductGridComponent extends BaseFormComponent implements OnInit, OnChanges, OnDestroy {
  readonly noSurchargeApplyId = NoSurchargeApplyId;

  activeColumns: Array<GridColumn> = [
    {
      name: 'isSelected',
      displayName: 'deal.worksheet.protectionProducts.customerSelection',
      sort: false,
      tooltip: true,
      columnClass: 'small-column',

      template: () => this.productToggle,
    },
    {
      name: 'productName',
      displayName: 'deal.worksheet.protectionProducts.productName',
      sort: false,
      columnClass: 'large-column',
      template: () => this.productDetails,
    },
    {
      name: 'coverageName',
      displayName: 'deal.worksheet.protectionProducts.coverage',
      sort: false,
      tooltip: true,
      columnClass: 'ellipsis large-column',
    },
    {
      name: 'term',
      displayName: 'deal.worksheet.protectionProducts.term',
      sort: true,
      columnClass: 'x-medium-column',
      tooltip: true,
      formatValue: (value) => {
        const termText = this.termPipe.transform(value.term, value.termType);
        const mileageText = this.mileagePipe.transform(value.mileage);

        return `${termText}\n${mileageText}`;
      },
    },
    {
      name: 'deductible',
      displayName: 'deal.worksheet.protectionProducts.deductible',
      sort: true,
      tooltip: true,
      columnClass: 'mat-column-align-right medium-column',
      formatValue: (value) => {
        const deductible = this.utilityService.formatAmount(value.deductible);
        const deductibleType =this.deductiblePipe.transform(value.deductibleType);
        return deductible ? `${deductible}\n${deductibleType}` : '';
      },
    },
    {
      name: 'totalSellingPrice',
      displayName: 'deal.worksheet.protectionProducts.customerCost',
      sort: true,
      tooltip: true,
      columnClass: 'mat-column-align-right x-medium-column',
      formatValue: (value) => {
        return this.utilityService.formatAmount(value.totalSellingPrice);
      },
    },
    {
      name: 'totalCostPrice',
      displayName: 'common.dc',
      sort: false,
      columnClass: 'mat-column-align-right x-medium-column',
      formatValue: (value) => {
        return this.utilityService.formatAmount(value.totalCostPrice);
      },
      hideColumn: true,
    },
    {
      name: 'action',
      displayName: 'common.deleteAction',
      sort: false,
      columnClass: 'medium-column ',
      template: () => this.actionColumn,
    },
  ];

  taxColumns: Array<GridColumn> = [
    {
      name: 'totalTaxAmount',
      displayName: 'deal.worksheet.protectionProducts.totalTaxAmount',
      sort: false,
      tooltip: true,
      columnClass: 'large-column mat-column-align-right',
      template: () => this.totalTaxAmountField,
    },
  ];

  @ViewChild('form', { static: false }) public form: NgForm;
  @ViewChild(MatGridComponent, { static: true }) matGrid: MatGridComponent;
  @ViewChild('actionColumn', { static: false }) actionColumn?: TemplateRef<HTMLElement>;
  @ViewChild('surchargesMenuTrigger') surchargesMenuTrigger: MatMenuTrigger;

  @Input() products: RatedProduct[];
  @Input() unitId: number;
  @Input() disableActions = false;
  @Input() isBlocked = false;
  @Input() isWorksheetTabLocked = false;
  @Input() hasTaxed = false;
  @Input() isContractGenerated = false;
  @Input() address: Address;
  @Input() taxableAmount$: Observable<number>;
  @Input() taxAmount$: Observable<number>;
  @Input() hasCustomerAddress = false;
  @Input() worksheetDetails: WorksheetDetails;

  _showDealerCost = false;
  isTaxDisabled = false;

  @Input()
  get showDealerCost() {
    return this._showDealerCost;
  }
  set showDealerCost(value: boolean) {
    this._showDealerCost = value;
    this.toggleHiddenColumns();
  }

  @Output() changeProducts = new EventEmitter<RatedProduct[]>();
  @Output() openProductDialog = new EventEmitter<RatedProduct>();
  @Output() calculateWorksheetDetails = new EventEmitter<void>();
  @Output() resetProtectionProducts = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<boolean>();
  @Output() setActiveProductId = new EventEmitter<string | number>();

  @ViewChild('productToggle', { static: false }) productToggle?: TemplateRef<HTMLElement>;
  @ViewChild('productDetails', { static: false }) productDetails?: TemplateRef<HTMLElement>;
  @ViewChild('totalTaxRateField', { static: false }) totalTaxRateField?: TemplateRef<HTMLElement>;
  @ViewChild('totalTaxAmountField', { static: false }) totalTaxAmountField?: TemplateRef<HTMLElement>;

  readonly defaultSortColumn = 'productName';
  readonly defaultSortDirection = SortDirection.Ascending;
  readonly sumOfColumnNames = ['totalSellingPrice', 'totalCostPrice', 'totalTaxAmount'];

  constructor(
    private modalService: ModalService,
    private utilityService: UtilityService,
    private termPipe: TermPipe,
    private mileagePipe: MileagePipe,
    private deductiblePipe: DeductiblePipe,
    public override rxjsService: RxjsService,
    public override eventService: EventService,
    private router: Router
  ) {
    super(eventService, rxjsService);

    this.subscription.add(
      this.eventService.dialogSaveEventObservable$.subscribe((accessoryDetails) => {
        this.triggerProductsChanged(accessoryDetails.protectionProduct, { tax: accessoryDetails.tax });
      })
    );
  }

  ngOnInit(): void {
    this.isTaxDisabled = this.products.every((product) => !product?.tax?.isTaxable);
    if (!this.isTaxDisabled) {
      this.taxColumns.map((tc) => this.activeColumns.splice(this.activeColumns.length - 1, 0, tc));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('products' in changes) {
      const { currentValue, previousValue, firstChange } = changes['products'];

      if (firstChange || JSON.stringify(currentValue) == JSON.stringify(previousValue)) return;

      setTimeout(() => this.matGrid.bindGrid(), 0);
    }
  }

  openModifyTaxDialog(event, product: RatedProduct) {
    event?.stopPropagation();
    const payload = { ...product, tax: { ...product.tax, componentAmount: product.totalSellingPrice } };
    this.setActiveProductId.emit(payload.id);

    const data = {
      title: 'common.taxes.protectionProductTaxes',
      salesOtherTaxes: payload.tax,
      customerAddress: this.address,
      protectionProduct: payload,
      taxAmount$: this.taxAmount$,
      taxableAmount$: this.taxableAmount$,
      name: payload.productName,
      effectiveTaxRate: 'deal.worksheet.tax.protectionProducts.effectiveTaxRate',
      salesTaxAmount: 'deal.worksheet.tax.protectionProducts.salesTaxAmount',
      routeKey: 'deals',
      disabled: this.disableActions || this.isWorksheetTabLocked || this.isPresentationCompleted,
      isCommonUseTaxes : this.worksheetDetails?.isCommonUseTaxes ?? false
    };
    const dialogRef = this.modalService.open(TaxConfigDialogComponent, data, 'modal-lg');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.calculateWorksheetDetails.emit();
      else this.resetProtectionProducts.emit();
    });
  }

  toggleHiddenColumns() {
    if (this.matGrid) this.matGrid.toggleHiddenColumns(this.showDealerCost);
  }

  toggle(protectionProduct: RatedProduct, isSelected: boolean) {
    this.triggerProductsChanged(protectionProduct, { isSelected: isSelected });
  }

  totalTaxRateChange(protectionProduct: RatedProduct, totalTaxRate: number) {
    const { isTaxAmountOverridden, totalSellingPrice, totalTaxAmount } = protectionProduct;
    const calculatedTotalTaxAmount = (totalSellingPrice * (totalTaxRate || 0)) / 100;
    const payload = { totalTaxRate: totalTaxRate, totalTaxAmount: calculatedTotalTaxAmount };
    if (isTaxAmountOverridden) {
      payload.totalTaxAmount = totalTaxAmount;
    }
    this.triggerProductsChanged(protectionProduct, payload);
  }

  totalTaxAmountChange(protectionProduct: RatedProduct, totalAmount: number) {
    this.triggerProductTaxChanged(protectionProduct, { totalAmount: totalAmount });
  }

  toggleTaxAmountOverridden(protectionProduct: RatedProduct, isAmountOverridden: boolean) {
    const totalTaxAmount = isAmountOverridden ? protectionProduct.tax?.totalAmount : null;
    const totalTaxRate = isAmountOverridden ? null : protectionProduct.tax?.totalRate;
    this.triggerProductTaxChanged(protectionProduct, { isAmountOverridden: isAmountOverridden, totalTaxAmount, totalTaxRate });
    this.markAsDirty();
  }

  private triggerProductsChanged(protectionProduct: RatedProduct, data: object) {
    const products = [...this.products].map((p) => {
      if (p.id == protectionProduct.id) {
        p = { ...p, ...data };
      }
      return p;
    });

    this.changeProducts.emit(products);
  }

  private triggerProductTaxChanged(protectionProduct: RatedProduct, data: object) {
    const products = [...this.products].map((p) => {
      if (p.id == protectionProduct.id) {
        p = { ...p, tax: { ...p.tax, ...data } };
      }
      return p;
    });

    this.changeProducts.emit(products);
  }

  openProductDetailsDialog(data: RatedProduct) {
    if (this.disableActions || this.isPresentationCompleted) return;
    this.openProductDialog.emit(data);
  }

  delete(event, protectionProduct: RatedProduct) {
    event?.stopPropagation();
    const data = {
      title: 'deal.worksheet.protectionProducts.confirmtionMessage.confirmation',
    };
    const dialogRef = this.modalService.openDeleteDialog(DeleteConfirmationDialogComponent, data, 'modal-sm');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeProducts.emit(this.products.filter((p) => p.id != protectionProduct.id));
        const products = this.products.filter((p) => p.id != protectionProduct.id);
        const taxedProductCount = products.filter((product) => product?.tax?.isTaxable).length;
        if (taxedProductCount === 0) this.eventService.dealTypeChangedObservable.next();

        this.deleteProduct.emit(true);
      }
    });
  }

  sumOfColumHandler(key: string, data: RatedProduct[]) {
    const isPresentationCompleted = data.some((p) => p.isSelected || p.isPresentationCompleted);
    return data
      .filter((d) => (isPresentationCompleted ? d.isSelected : true))
      .map((t) => t[key])
      .reduce((acc, value) => acc + value, 0);
  }

  gotoCustomerAddressTab(data: RatedProduct) {
    if (this.isContractGenerated && this.isTaxes(data.tax)) return;

    const dealId = this.router.url.split('/')[2];
    this.router.navigateByUrl(`deals/${dealId}/customers/address`);
  }

  isTaxes(tax: ComponentTax) {
    return tax.rates.length === 0 && tax.jurisdictionType === TaxJurisdiction.Customer && tax.isTaxed === true && tax.isSameAsUnit === false;
  }

  isWarningMessage(tax: ComponentTax) {
    return !this.hasCustomerAddress && tax.jurisdictionType == TaxJurisdiction.Customer;
  }

  closeMenu() {
    this.surchargesMenuTrigger.closeMenu();
  }

  get isPresentationCompleted() {
    return this.worksheetDetails?.isPresentationCompleted && !!this.worksheetDetails.primaryCustomerName;
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
