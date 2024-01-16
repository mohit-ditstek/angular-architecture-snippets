import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Option } from '@app/entities';
import { UserManagementFacade } from '@app/store/user-management';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts-dropdown',
  templateUrl: './contacts-dropdown.component.html',
  styleUrls: ['./contacts-dropdown.component.scss'],
})
export class ContactsDropdownComponent implements OnInit, OnDestroy {
  @Input() placeholder = '';
  @Input() label?: string;
  @Input() name = '';
  @Input() submitted = false;
  @Input() required = false;
  @Input() disabled = false;
  @Input() hideLabel = false;
  @Input() simpleSelect = false;
  @Input() value?: number | string;
  @Output() selection = new EventEmitter<Option>();
  @Input() showDefaultOption? = false;
  @Input() fAndIPerson = false;

  options: Option[] = [];

  private subscription = new Subscription();

  constructor(private userManagementFacade: UserManagementFacade) {}

  ngOnInit() {
    this.subscription.add(
      this.userManagementFacade.contacts$.subscribe((res) => {
        if (res) {
          const contacts = this.fAndIPerson ? res.fandIPersons : res.salesPersons;
          this.options = (contacts || []).map((name) => {
            return {
              text: name,
              value: name,
            } as Option;
          });
        }
      })
    );

    this.userManagementFacade.getContacts();
  }

  selectionChange(selected: number) {
    const salesPerson = this.options.find((x) => x.value == selected);
    this.selection.emit(salesPerson);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
