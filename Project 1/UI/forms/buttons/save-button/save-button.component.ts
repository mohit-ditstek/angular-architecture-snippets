import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { EventService, StorageService } from '@app/shared/services';
import { StorageKeys } from '@app/shared/utils';
import { AppFacade } from '@app/store/app';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
})
export class SaveButtonComponent implements OnDestroy {
  vm$ = this.appFacade.saveButtonStatusesVm$;
  @Input() color: string;

  private _isValid = false;
  private _isFormDirty = false;

  constructor(private appFacade: AppFacade, private storageService: StorageService, private eventService: EventService) {}

  @Input()
  get isFormValid() {
    return this._isValid;
  }

  set isFormValid(value: boolean) {
    // For Handling Profile Menu
    this.storageService.set(StorageKeys.FormInvalid, !value, true);
    this._isValid = value;
  }

  @Input()
  get isFormDirty() {
    return this._isFormDirty;
  }

  set isFormDirty(value: boolean) {
    // For Handling Profile Menu
    this.storageService.set(StorageKeys.FormDirty, value, true);
    this._isFormDirty = value;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      event.preventDefault();
      this.save();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    const hasLogoutProcessStarted = this.eventService.hasLogoutProcessStarted();
    if (!hasLogoutProcessStarted && this.isFormDirty) {
      event.returnValue = '';
      return false;
    }

    this.eventService.setLogoutProcess(false);
    return true;
  }

  save() {
    this.eventService.saveObservable.next();
  }

  resetSessionStorage() {
    this.storageService.remove(StorageKeys.FormInvalid, true);
    this.storageService.remove(StorageKeys.FormDirty, true);
  }

  ngOnDestroy(): void {
    this.resetSessionStorage();
  }
}
