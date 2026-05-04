/**
 * COMPONENT PATTERNS - Standalone Architecture
 * 
 * Modern Angular components are standalone with minimal boilerplate.
 * Smart vs Presentational component separation maintains clarity.
 * Strong typing throughout the component.
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================
// INTERFACES
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ComponentState {
  users: User[];
  loading: boolean;
  selectedUser: User | null;
  error: string | null;
}

// ============================================
// SMART COMPONENT (Container)
// Handles data management and state
// ============================================

@Component({
  selector: 'app-user-list-container',
  standalone: true,
  imports: [CommonModule, UserListPresentationalComponent],
  template: `
    <div>
      <div *ngIf="loading$ | async" class="spinner">Loading...</div>
      <div *ngIf="error$ | async as error" class="error">{{ error }}</div>

      <app-user-list
        [users]="(users$ | async) || []"
        [selectedUserId]="(selectedUser$ | async)?.id"
        (onSelectUser)="onSelectUser($event)"
        (onDeleteUser)="onDeleteUser($event)"
        (onEditUser)="onEditUser($event)"
      />
    </div>
  `
})
export class UserListContainerComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedUser$: Observable<User | null>;

  constructor(
    private facade: UserFacade,
    private store: Store
  ) {
    this.users$ = this.store.select(selectUsers);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.selectedUser$ = this.store.select(selectSelectedUser);
  }

  ngOnInit(): void {
    this.facade.loadUsers();
  }

  onSelectUser(userId: string): void {
    this.facade.selectUser(userId);
  }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure?')) {
      this.facade.deleteUser(userId);
    }
  }

  onEditUser(userId: string): void {
    // Navigate to edit page or open modal
  }
}

// ============================================
// PRESENTATIONAL COMPONENT (Dumb)
// Accepts inputs, emits outputs
// ============================================

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list">
      <div class="list-header">
        <h2>Users</h2>
        <button (click)="onCreateClick()">+ New User</button>
      </div>

      <table *ngIf="users && users.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let user of users"
            [class.selected]="user.id === selectedUserId"
            (click)="selectUser(user.id)"
          >
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button (click)="edit(user.id, $event)">Edit</button>
              <button (click)="delete(user.id, $event)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="users && users.length === 0" class="empty-state">
        No users found
      </div>
    </div>
  `,
  styleUrls: ['./user-list.component.scss']
})
export class UserListPresentationalComponent {
  @Input() users: User[] | null = null;
  @Input() selectedUserId: string | null = null;

  @Output() onSelectUser = new EventEmitter<string>();
  @Output() onEditUser = new EventEmitter<string>();
  @Output() onDeleteUser = new EventEmitter<string>();
  @Output() onCreateClick = new EventEmitter<void>();

  selectUser(userId: string): void {
    this.onSelectUser.emit(userId);
  }

  edit(userId: string, event: Event): void {
    event.stopPropagation();
    this.onEditUser.emit(userId);
  }

  delete(userId: string, event: Event): void {
    event.stopPropagation();
    this.onDeleteUser.emit(userId);
  }
}

// ============================================
// FORM COMPONENT
// Demonstrates reactive forms with strong typing
// ============================================

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          formControlName="name"
          id="name"
          type="text"
          placeholder="Enter name"
        />
        <div *ngIf="getFieldError('name')">
          {{ getFieldError('name') }}
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          formControlName="email"
          id="email"
          type="email"
          placeholder="Enter email"
        />
        <div *ngIf="getFieldError('email')">
          {{ getFieldError('email') }}
        </div>
      </div>

      <div class="form-group">
        <label for="role">Role</label>
        <select formControlName="role" id="role">
          <option>Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        [disabled]="form.invalid || isSubmitting"
      >
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </button>
    </form>
  `
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() initialData?: Partial<UserFormData>;
  @Output() onSubmit = new EventEmitter<UserFormData>();

  form: FormGroup;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]],
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);

    if (!field || !field.errors || !field.touched) {
      return null;
    }

    if (field.errors['required']) {
      return `${fieldName} is required`;
    }

    if (field.errors['email']) {
      return 'Invalid email format';
    }

    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} characters`;
    }

    return null;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.onSubmit.emit(this.form.value);
    }
  }
}

// ============================================
// COMPONENT PATTERNS SUMMARY
// ============================================

/*
SMART vs PRESENTATIONAL:
- Smart: Gets data from store/services, manages state
- Presentational: Just displays data, emits user actions

STANDALONE COMPONENTS:
- imports: [CommonModule, ReactiveFormsModule] - explicit dependencies
- templateUrl/styleUrls: separated concerns
- No NgModule needed

STRONG TYPING:
- Interface for component data
- FormBuilder with typed output
- @Input/@Output with types

LIFECYCLE:
- OnInit: Initialize component
- OnDestroy: Cleanup subscriptions
- Always unsubscribe with takeUntil and destroy$

BEST PRACTICES:
✅ Use reactive forms for complex forms
✅ Use FormsModule for simple template forms
✅ Unsubscribe in OnDestroy
✅ Use async pipe in templates
✅ Keep presentational components pure
✅ Inject services in smart components only
*/
