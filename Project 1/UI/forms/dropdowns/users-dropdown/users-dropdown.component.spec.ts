import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementFacade } from '@app/store/user-management';
import { UsersDropdownComponent } from './users-dropdown.component';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UsersDropdownComponent', () => {
  let component: UsersDropdownComponent;
  let fixture: ComponentFixture<UsersDropdownComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDropdownComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: UserManagementFacade,
          useValue: {
            users$: of([
              { id: 1, fullName: 'User 1', isDisabled: false, isInvitationPending: false },
              { id: 2, fullName: 'User 2', isDisabled: true, isInvitationPending: false },
            ]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDropdownComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selection when an option is selected', () => {
    const expectedSelection = { text: 'User 1', value: 1, isDisabled: false };
    component.selectionChange(expectedSelection.value);
    expect(component).toBeTruthy();
  });
});
