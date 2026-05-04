import { Injectable, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersSearch } from '@app/entities';
import { UtilityService } from '@app/shared/services';
import { AppFacade } from '@app/store/app';
import { UserFacade } from '@app/store/user';
import { Subscription } from 'rxjs';
import { BaseAutoComplete } from './base-auto-complete';

@Injectable()
export abstract class BaseUserFieldAutoComplete<T> extends BaseAutoComplete<T> implements OnDestroy {
  autoComplete: Array<UsersSearch> = [];
  preventCall: boolean;
  autoCompleteSubscription: Subscription;

  constructor(public override ngForm: NgForm, public override appFacade: AppFacade, public userFacade: UserFacade, public utilityService: UtilityService) {
    super(ngForm, appFacade);
  }

  clearAutoComplete() {
    this.userFacade.resetCustomerSeachResult();
  }

  preventSpace(event) {
    this.utilityService.preventSpace(event);
  }

  //  Reset state and result array after type new value
  resetSearch() {
    this.preventCall = true;
    this.clearAutoComplete();
  }

  autoCompleteSelection() {
    this.clearAutoComplete();
    this.preventCall = false;
  }
}
