import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Option } from '@app/entities';
import { UserManagementFacade } from '@app/store/user-management';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-users-dropdown',
  templateUrl: './users-dropdown.component.html',

})
export class UsersDropdownComponent implements OnInit, OnDestroy {
  loading = true;
  @Input() placeholder = '';
  @Input() label?: string;
  @Input() name = '';
  @Input() submitted = false;
  @Input() required = false;
  @Input() disabledControl = false;
  @Input() hideLabel = false;
  @Input() simpleSelect = false;
  @Input() value?: number | string;
  
  @Input() selectedText: string;
  @Input() showDefaultOption? = false;

  @Output() selection = new EventEmitter<Option>();
  
  options: Option[] = [];

  subscription: Subscription = new Subscription();

  constructor(private userManagementFacade: UserManagementFacade) { }

  ngOnInit() {
    this.subscription.add(
      this.userManagementFacade.activeUsers$.subscribe(res => {
        if (res && res.length > 0) {
          const filteredUserList = res.filter((u) => (!u.isDisabled || (u.isDisabled && (u.id == this.value)))).sort((a, b) => Number(a.isDisabled) - Number(b.isDisabled));
          this.options = filteredUserList.map(user => {
            return {
              text: user.fullName,
              value: user.id,
              isDisabled: user.isDisabled
            };
          });

          this.showSelectionFromText();
        }
      })
    );

  }

  selectionChange(selected: number) { 
    const user = this.options.find((x) => x.value == selected);
    this.selection.emit(user);
  }

  showSelectionFromText() {
    if (this.selectedText) {
      let user = this.options.find((x) => x.text == this.selectedText);
      if (!user) {
        user = {
          text: this.selectedText,
          value: '-1',
          isDisabled: true
        };

        this.options.push(user);
      } 
      
      this.value = user.value;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
