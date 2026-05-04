import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FeatureFlagsService } from '@app/base';
import { ProtectionProductsButtonsComponent } from './protection-products-buttons.component';

describe('ProtectionProductsButtonsComponent', () => {
  let component: ProtectionProductsButtonsComponent;
  let fixture: ComponentFixture<ProtectionProductsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtectionProductsButtonsComponent ],
      imports: [
        MatMenuModule,
        MatTooltipModule,
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: FeatureFlagsService, useValue: {isFeatureEnabled: jest.fn()}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectionProductsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should check performAction action', () => {
    it('should open rating dialog', () => {
      const mockEventMethod = jest.spyOn(component.openRatingDialog, 'emit');
      component.noProtectionProducts = true;
      component.performAction();
      expect(mockEventMethod).toHaveBeenCalled();
    });
    it('should open generate contract dialog', () => {
      const mockEventMethod = jest.spyOn(component.openContractDialog, 'emit');
      component.noProtectionProducts = false;
      component.isPresentationCompleted = true;
      component.performAction();
      expect(mockEventMethod).toHaveBeenCalled();
    });
    it('should open rating present dialog', () => {
      const mockEventMethod = jest.spyOn(component.openRatingDialog, 'emit');
      component.noProtectionProducts = false;
      component.isPresentationCompleted = false;
      component.performAction();
      expect(mockEventMethod).toHaveBeenCalled();
      expect(mockEventMethod).toHaveBeenCalledWith(true);
    });
  });

  it('should check resetProducts method', () => {
    const mockEventMethod = jest.spyOn(component.resetAllProducts, 'emit');
    component.resetProducts();
    expect(mockEventMethod).toHaveBeenCalled();
  });
  it('should handle minMaxValidation method', () => {
    const mockEventMethod = jest.spyOn(component.showDealerCost, 'emit');
    component.toggleDealerCost(true);
    expect(component).toBeTruthy();
    expect(mockEventMethod).toHaveBeenCalledWith(true);
  });

  it('should open manual product dialog', () => {
    const mockEventMethod = jest.spyOn(component.openDealerProductDialog, 'emit');
    component.openProductDialog();
    expect(mockEventMethod).toHaveBeenCalled();
  });
});
