import { CUSTOM_ELEMENTS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentTax, DeductibleType, RatedProduct, RatedProductData, WorksheetDetails } from '@app/entities';
import { PipesModule } from '@app/shared/pipes';
import { MockDialogService, ModalService } from '@app/shared/services';
import { AngularTestingRootModule } from '@app/shared/testing';
import { ProtectionProductGridComponent } from './protection-product-grid.component';

describe('ProtectionProductComponent', () => {
  let component: ProtectionProductGridComponent;
  let fixture: ComponentFixture<ProtectionProductGridComponent>;
  let matMenuTrigger: MatMenuTrigger;
  

  const ratedProduct: RatedProduct[] =[{
    providerId: 0,
    providerName: '',
    isRated: false,
    unitId: 0,
    category: '',
    programId: '',
    programName: '',
    productId: '',
    productName: '',
    coverageId: '',
    coverageName: '',
    coverageDescription: '',
    coverageItemId: '',
    term: 0,
    mileage: 0,
    deductible: 0,
    deductibleType: DeductibleType.Normal,
    msrp: 0,
    costPrice: 0,
    totalCostPrice: 0,
    sellingPrice: 0,
    totalSellingPrice: 0,
    maxSellingPrice: 0,
    isSelected: false,
    surcharges: []
  }];

  const TaxRate:ComponentTax = {
    componentType: 0,
    componentTypeLabel: '',
    isTaxed: false,
    isSameAsUnit: false,
    isAmountOverridden: false,
    totalAmount: 0,
    totalRate: 0,
    isDirty: false,
    isValid: false,
    rates: [{label:'delhi',rate:200,isDisabled:true}],
    jurisdictionType: 1,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProtectionProductGridComponent],
      imports: [
        AngularTestingRootModule,
        TranslateModule.forRoot({}),
        PipesModule,
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ModalService,
          useValue: MockDialogService
        },
        WorksheetDetails,
        {
          provide: MatMenuTrigger,
          useValue: {
            closeMenu: jest.fn(),
            openMenu: jest.fn(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectionProductGridComponent);
    component = fixture.componentInstance;
    component.hasTaxed = true;
    component.products = ratedProduct;
    matMenuTrigger = TestBed.inject(MatMenuTrigger);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check onChange method', () => {
    const change: SimpleChanges = {
      products: {
        currentValue: null,
        previousValue: null,
        firstChange: true,
        isFirstChange: function (): boolean {
          throw new Error('Function not implemented.');
        }
      }
    };
    component.ngOnChanges(change);
  });

  it('should check toggle method', () => {
    const mockEmitMethod = jest.spyOn(component.changeProducts, 'emit');
    const product = [{ ...ratedProduct[0], isSelected: true }];
    component.toggle(ratedProduct[0], true);
    expect(mockEmitMethod).toHaveBeenCalled();
    expect(mockEmitMethod).toHaveBeenCalledWith(product);
  });

  it('should check totalTaxRateChange method', () => {
    const mockEmitMethod = jest.spyOn(component.changeProducts, 'emit');
    component.totalTaxRateChange(ratedProduct[0], 5);
    expect(mockEmitMethod).toHaveBeenCalled();
  });

  it('should check totalTaxRateChange method', () => {
    const mockEmitMethod = jest.spyOn(component.changeProducts, 'emit');
    component.totalTaxAmountChange(ratedProduct[0], 5);
    expect(mockEmitMethod).toHaveBeenCalled();
  });

  it('should check toggleTaxAmountOverridden method', () => {
    const mockEmitMethod = jest.spyOn(component.changeProducts, 'emit');
    component.toggleTaxAmountOverridden(ratedProduct[0], true);
    expect(mockEmitMethod).toHaveBeenCalled();
  });

  it('should check openProductDetailsDialog method', () => {
    const mockEmitMethod = jest.spyOn(component.openProductDialog, 'emit');
    const data = ratedProduct[0];
    component.openProductDetailsDialog(data);
    expect(mockEmitMethod).toHaveBeenCalled();
    expect(mockEmitMethod).toHaveBeenCalledWith(data);
  });

  it('should check delete method', () => {
    const event = { stopPropagation: jest.fn() };
    const mockEmitChangeProductMethod = jest.spyOn(component.changeProducts, 'emit');
    const mockEmitDeleteProductMethod = jest.spyOn(component.changeProducts, 'emit');
    component.delete(event, ratedProduct[0]);
    expect(mockEmitChangeProductMethod).toHaveBeenCalled();
    expect(mockEmitDeleteProductMethod).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should calculate the sum of selected products', () => {
    const sumOfSelectedSellingPrice = component.sumOfColumHandler('totalSellingPrice', RatedProductData);
    const sumOfSelectedCostPrice = component.sumOfColumHandler('totalCostPrice', RatedProductData);
    const sumOfSelectedTaxAmount = component.sumOfColumHandler('totalTaxAmount', RatedProductData);
    expect(sumOfSelectedSellingPrice).toEqual(2200);
    expect(sumOfSelectedCostPrice).toEqual(1700);
    expect(sumOfSelectedTaxAmount).toEqual(2400);
  });


  it('should toggle hidden columns in matGrid', () => {
    const mockMatGrid = {
      toggleHiddenColumns: jest.fn(),
    } as any;
    component.matGrid = mockMatGrid;
    component.showDealerCost = true;
    component.toggleHiddenColumns();
    expect(mockMatGrid.toggleHiddenColumns).toHaveBeenCalledWith(true);
  });
  it('should handle getPrice method', () => {
    const event = { stopPropagation: jest.fn() };
    component.openModifyTaxDialog(event, ratedProduct[0]);
    expect(component).toBeTruthy();
  });
  it('should handle toggleHiddenColumns() method', () => {
    component.toggleHiddenColumns();
    expect(component).toBeTruthy();
  });
  it('should handle  closeMenu() method', () => {
    component.surchargesMenuTrigger = matMenuTrigger;
    component.closeMenu();
    expect(component).toBeTruthy();
  });
  it('should handle  isTaxes(tax) method', () => {
    component.isTaxes(TaxRate);
    expect(component).toBeTruthy();
  });
  it('should handle  isWarningMessage method', () => {
    component.isWarningMessage(TaxRate);
    expect(component).toBeTruthy();
  });
});
