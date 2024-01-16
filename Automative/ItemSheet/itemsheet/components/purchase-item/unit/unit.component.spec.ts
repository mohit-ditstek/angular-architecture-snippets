import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseUnit, UnitFee } from '@app/entities';
import { ItemizeDialogComponent } from '@app/shared/components';
import { PipesModule } from '@app/shared/pipes';
import { MockDialogService, ModalService } from '@app/shared/services';
import { AngularTestingRootModule, MockRouterService } from '@app/shared/testing';
import { CustomFormsModule } from '@app/shared/ui';
import { ComponentDataTax, PurchaseUnitData } from '@app/store/deal';
import { UnitComponent } from './unit.component';

const unitFee: UnitFee[] = [
  {
    amount: 100,
    name: 'Demo 1',
    type: 1,
  },
  {
    amount: 200,
    name: 'Demo 2',
    type: 2,
  },
];

const data: PurchaseUnit = {
  id: 1,
  label: '',
  sellingPrice: 1,
  freight: 1,
  dealerPrep: 1,
  totalSellingPrice: 1,
  totalFees: 200,
  products: [],
  fees: unitFee,
  isDirty: false,
  isValid: true,
  isProductPresentationCompleted: false,
  isProductSelected: false,
  isAnyProductSelectionDisabled: false,
  totalComponentsSellingPrice: 0,
  unitImportId: '',
  totalInstalledPartsAccessories: 123,
  totalInstalledPartsAccessoriesCalculated: 223,
  totalLabor: 23,
  totalLaborCalculated: 345,
  taxes: []
};
describe('UnitComponent', () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;
  let modalService: ModalService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitComponent],
      imports: [AngularTestingRootModule, TranslateModule.forRoot({}), PipesModule, CustomFormsModule],
      providers: [
        {
          provide: ModalService,
          useValue: MockDialogService,
        },
        {
          provide: Router,
          useValue: MockRouterService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitComponent);
    component = fixture.componentInstance;
    component.purchaseUnit = data;
    fixture.detectChanges();
    modalService = TestBed.inject(ModalService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should check formValuesChanged method', () => {
    const mockEventMethod = jest.spyOn(component.purchaseUnitChanged, 'emit');
    component.formValuesChanged();
    expect(mockEventMethod).toHaveBeenCalled();
  });

  describe('toggleOverrideAccessories', () => {
    it('should toggle overrideTotalInstalledPartsAccessories and totalInstalledPartsAccessories', () => {
      component.unitForm = PurchaseUnitData[0];
      component.unitForm.totalInstalledPartsAccessories = 0;
      const checked = true;
      component.toggleOverrideAccessories(checked);
      expect(component.unitForm.totalInstalledPartsAccessories).toBe(0);
    });

    it('should toggle overrideTotalInstalledPartsAccessories and totalInstalledPartsAccessories', () => {
      const originalCalculatedValue = 567;
      component.unitForm = PurchaseUnitData[0];
      const checked = true;
      component.toggleOverrideAccessories(checked);
      expect(component.unitForm.overrideTotalInstalledPartsAccessories).toBe(checked);
      expect(component.unitForm.totalInstalledPartsAccessories).toBe(0);
      component.toggleOverrideAccessories(false);
      expect(component.unitForm.overrideTotalInstalledPartsAccessories).toBe(false);
      expect(component.unitForm.totalInstalledPartsAccessories).toBe(originalCalculatedValue);
    });

    it('should call markAsDirty', () => {
      const markAsDirtySpy = jest.spyOn(component, 'markAsDirty');
      component.toggleOverrideAccessories(true);
      expect(markAsDirtySpy).toHaveBeenCalled();
    });
  });

  describe('toggleOverrideLabor', () => {
    it('should toggle overrideTotalLabor and totalLabor', () => {
      component.unitForm = PurchaseUnitData[0];
      component.unitForm.totalLabor = 0;
      const checked = true;
      component.toggleOverrideLabor(checked);
      expect(component.unitForm.overrideTotalLabor).toBe(checked);
      expect(component.unitForm.totalLabor).toBe(0);
    });

    it('should toggle overrideTotalLabor and totalLabor', () => {
      const originalCalculatedValue = 800;
      component.unitForm = PurchaseUnitData[0];
      const checked = true;
      component.toggleOverrideLabor(checked);
      expect(component.unitForm.overrideTotalLabor).toBe(checked);
      expect(component.unitForm.totalLabor).toBe(0);
      component.toggleOverrideLabor(false);
      expect(component.unitForm.overrideTotalLabor).toBe(false);
      expect(component.unitForm.totalLabor).toBe(originalCalculatedValue);
    });

    it('should call markAsDirty', () => {
      const markAsDirtySpy = jest.spyOn(component, 'markAsDirty');
      component.toggleOverrideLabor(true);
      expect(markAsDirtySpy).toHaveBeenCalled();
    });
  });

  it('should toggle isFeesOverridden and call handleFees', () => {
    component.unitForm = {
      ...PurchaseUnitData[0],
      isFeesOverridden: false,
      fees: [],
    };
    component.toggleOverrideFees(false);
    expect(component.unitForm.isFeesOverridden).toBe(false);
  });

  
  it('should toggle isFeesOverridden and call handleFees totalFees is > 0', () => {
    component.unitForm = {
      ...PurchaseUnitData[0],
      isFeesOverridden: false,
      fees: [],
    };
    component.unitForm.totalFees = 15;
    component.toggleOverrideFees(true);
    expect(component.unitForm.isFeesOverridden).toBe(true);
  });
  it('should toggle isFeesOverridden and call handleFees totalFees is 0', () => {
    component.unitForm = {
      ...PurchaseUnitData[0],
      isFeesOverridden: false,
      fees: [],
    };
    component.unitForm.totalFees = 0;
    component.toggleOverrideFees(true);
    expect(component.unitForm.isFeesOverridden).toBe(true);
  });

  it('should open dialog and update fees, call handleFees, and call formValuesChanged', () => {
    const spyOnService = jest.spyOn(modalService, 'open');
    const originalFees = [
      { amount: 100, name: 'Document Finance', type: 1 },
      { amount: 300, name: 'Dealer fee Finance', type: 3 },
    ];
    component.unitForm = {
      ...PurchaseUnitData[0],
      isFeesOverridden: false,
      fees: originalFees,
    };
    const mockDialogResult = {
      itemizeFee: {
        fees: originalFees,
      },
      disabled: false
    };
    component.openItemizeDialog();
    expect(spyOnService).toHaveBeenCalledWith(ItemizeDialogComponent, mockDialogResult, 'modal-md');
    expect(component.unitForm.fees).toEqual(mockDialogResult.itemizeFee.fees);
  });


  describe('should toggle override vehicle tax method all senariors', () => {
    it('should toggle override vehicle tax and update form', () => {
      const markAsDirtySpy = jest.spyOn(component, 'markAsDirty');
      component.unitForm.taxes = [];
      component.toggleOverrideVehicleTax(false);
      expect(component.unitForm.isVehicleTaxOverridden).toBeFalsy();
      expect(markAsDirtySpy).toHaveBeenCalled();
    });
    it('should check with false', () => {
      component.unitForm = PurchaseUnitData[0];
      component.unitForm.vehicleTax = 15; 
      component.toggleOverrideVehicleTax(true);
      expect(component.unitForm.isVehicleTaxOverridden).toBe(true);
      expect(component.unitForm.vehicleTax).toBe(15);
    });

    it('should check with false and vehicleTax 0', () => {
      component.unitForm = PurchaseUnitData[0];
      component.unitForm.vehicleTax = 0; 
      component.toggleOverrideVehicleTax(true); 
      expect(component.unitForm.isVehicleTaxOverridden).toBe(true);
      expect(component.unitForm.vehicleTax).toBe(0);
    });
  });

  it('should check openModifyTaxDialog method', () => {
    const mockDialog = jest.spyOn(modalService, 'open');
    component.openModifyTaxDialog();
    expect(mockDialog).toHaveBeenCalled();
  });
  describe('should check toggleOverrideTax method scenarios', () => {
    it('should check when checked is false', () => {
      component.toggleOverrideTax(false);
      expect(component.unitForm.isVehicleTaxOverridden).toBeFalsy();
    });
    it('should check when checked is false', () => {
      const mockDialog = jest.spyOn(modalService, 'open');
      component.toggleOverrideTax(true);
      expect(mockDialog).toHaveBeenCalled();
    });
  });
  it('should check gotoCustomerAddressTab method', () => {
    const mockRouter = jest.spyOn(router, 'navigateByUrl');
    component.gotoCustomerAddressTab();
    expect(mockRouter).toHaveBeenCalled();
  });

  it('should check isCustomerAddress', () => {
    expect(component.isCustomerAddress).toBe(false);
  });
  it('should check isTaxJurisdictionOutOfState', () => {
    component.purchaseUnit.isTaxJurisdictionOutOfState = true;
    expect(component.isTaxJurisdictionOutOfState).toBe(true);
  });
  it('should check isDisable', () => {
    component.purchaseUnit.taxes = ComponentDataTax;
    expect(component.isDisable).toBe(true);
  });

  it('should check isDisable', () => {
    component.isContractGenerated = true;
    expect(component.isDisable).toBe(true);
  });
  it('should check isDisable', () => {
    component.unitForm.isVehicleTaxOverridden = true;
    expect(component.isDisable).toBe(true);
  });
  it('should check coverageTaxProfile', () => {
    const mockSpy = jest.spyOn(component.taxProfileChanged ,'emit');
    component.changeTaxProfile(23);
    expect(mockSpy).toHaveBeenCalled();
  });
});
