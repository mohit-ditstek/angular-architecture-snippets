import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { AdminPermission, MenuGroup, MenuItem, Permission, QuickActionModel, ViewType } from '@app/entities';
import { EventService } from '@app/shared/services';
import { PermissionService, UserFacade } from '@app/store/user';
import { Subscription } from 'rxjs';

@Injectable()
export abstract class BaseQuickActionsComponent implements OnDestroy {
  abstract actionsConfig: MenuGroup[];
  abstract footerActionsConfig: MenuItem[];
  abstract viewType: ViewType;
  abstract orgId?: number;
  abstract getQuickActions(): void;

  abstract currentTabDirty: boolean;
  abstract currentTabInvalid: boolean;

  @Output() action = new EventEmitter<QuickActionModel>();

  public subscription = new Subscription();

  public menuGroupActions: MenuGroup[];
  public footerActions: MenuItem[];

  readonly listingView = ViewType.Listing;

  public loaded = false;
  public isImpersonatedUser: boolean;
  public isIntegrationEnabled?: boolean;

  private openQuickMenuAfterSave = false;

  constructor(public userFacade: UserFacade, public permissionService: PermissionService, public eventService: EventService) {
    this.subscription.add(this.userFacade.currentOrgId$.subscribe((id) => (this.orgId = id)));
    this.subscription.add(this.userFacade.user$.subscribe((userData) => (this.isImpersonatedUser = userData.isImpersonatedUser)));

    this.subscription.add(
      this.eventService.backgroundCallCompletedObservable$.subscribe(() => {
        if (this.openQuickMenuAfterSave) {
          this.getQuickActions();
          this.openQuickMenuAfterSave = false;
        }
      })
    );
  }

  buildQuickActionMenu(actions: QuickActionModel[]) {
    this.loaded = actions.length > 0;
    if (!this.loaded) return;

    // Filtering Groups
    const menuGroups = this.actionsConfig.filter((group) => this.groupFilterPredicate(group));
    
    // Filtering Group Menu
    this.menuGroupActions = menuGroups.map((group) => {
      const menu = this.filterActions(actions, group.menu);
      return { ...group, menu };
    });

    // Filtering Footer Action Menu
    this.footerActions = this.filterActions(actions, this.footerActionsConfig);
  }

  // Predicate to filter out group and it can be override by inherited components
  groupFilterPredicate(_group: MenuGroup) {
    return true;
  }

  clickQuickActions() {
    if (this.currentTabDirty && !this.currentTabInvalid) {
      this.eventService.saveObservable.next();
      this.openQuickMenuAfterSave = true;
    } else {
      this.getQuickActions();
    }
  }

  private filterActions(allActions: QuickActionModel[], items: MenuItem[]) {
    if (items?.length == 0) return items;

    const menuItems: MenuItem[] = [];
    for (const item of items) {
      if (item.showIfImpersonate && !this.isImpersonatedUser) continue;
      if (this.viewType == ViewType.Listing && item.viewType == ViewType.Details) continue;

      const action = allActions.find((qa) => qa.name == item.key);
      if (!action) continue;

      const enabled = action.isEnabled && this.isGranted(item.requiredPermissions) && (item.viewType === ViewType.Details ? this.isIntegrationEnabled : true);
      const manuallyEnabled = action.isEnabled && item.isEnabled;

      menuItems.push({
        ...item,
        isEnabled: enabled || manuallyEnabled,
        isAddressAvailable: action.isAddressAvailable,
        creditAppId: action.creditAppId,
        tags: action?.tags,
        id: action.id,
      });
    }
    return menuItems;
  }

  private isGranted(permissions: (Permission | AdminPermission)[]) {
    return permissions?.length > 0 ? permissions.some((permission) => this.permissionService.permissionIsGranted(permission)) : true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
