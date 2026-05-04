import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FeatureFlagsService } from '@app/base';
import { FeatureFlag } from '@app/entities';

@Component({
  selector: 'app-protection-products-buttons',
  templateUrl: './protection-products-buttons.component.html',
  styleUrls: ['./protection-products-buttons.component.scss'],
})
export class ProtectionProductsButtonsComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  @Input() isCustomerLocked = false;
  @Input() isPresentationCompleted = false;
  @Input() noProtectionProducts = false;
  @Input() disableActions = false;
  @Input() isLocked = false;
  @Input() isBlocked = false;
  @Input() showDealerCostToggle: boolean;
  @Input() dealerCostToggle = false;

  @Output() openRatingDialog = new EventEmitter<boolean>();
  @Output() openContractDialog = new EventEmitter<void>();
  @Output() resetAllProducts = new EventEmitter<void>();
  @Output() showDealerCost = new EventEmitter<boolean>();
  @Output() openDealerProductDialog = new EventEmitter<void>();

  menuEnabled: boolean;

  constructor(private featureFlagsService: FeatureFlagsService) {}

  ngOnInit(): void {
    this.menuEnabled = this.featureFlagsService.isFeatureEnabled(FeatureFlag.MenuEnabled);
  }

  performAction() {
    if (this.noProtectionProducts || (this.isBlocked && !this.isPresentationCompleted)) {
      this.openDialog();
    } else {
      if (this.isPresentationCompleted) {
        this.openGenerateContractValidationDialog();
      } else {
        this.openDialog(true);
      }
    }
  }

  openDialog(present = false) {
    this.openRatingDialog.emit(present);
  }

  openGenerateContractValidationDialog() {
    this.openContractDialog.emit();
  }


  resetProducts() {
    this.resetAllProducts.emit();
  }

  toggleDealerCost(show: boolean) {
    this.showDealerCost.emit(show);
  }

  openProductDialog() {
    this.openDealerProductDialog.emit();
  }

  get isRefreshProductDisabled() {
    return this.isCustomerLocked || this.noProtectionProducts;
  }
  get isAddProductDisabled() {
    return this.isCustomerLocked || this.isPresentationCompleted;
  }
}
