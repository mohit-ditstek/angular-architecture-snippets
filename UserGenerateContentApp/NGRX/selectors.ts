/**
 * SELECTORS PATTERN - Memoized, Efficient State Queries
 * 
 * Selectors are memoized functions that extract data from state.
 * They prevent unnecessary component re-renders and are reusable.
 * Composition allows selectors to build on top of each other.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';

// ============================================
// STATE INTERFACES
// ============================================

export interface UserState {
  entities: Record<string, User>;
  ids: string[];
  currentUserId: string | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    role: 'admin' | 'user' | 'all';
    sortBy: 'name' | 'email' | 'created';
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AppState {
  user: UserState;
}

// ============================================
// FEATURE SELECTOR
// ============================================

export const selectUserFeature = createFeatureSelector<UserState>('user');

// ============================================
// SINGLE-LEVEL SELECTORS - Base selectors
// ============================================

export const selectUserEntities = createSelector(
  selectUserFeature,
  (state) => state.entities
);

export const selectUserIds = createSelector(
  selectUserFeature,
  (state) => state.ids
);

export const selectCurrentUserId = createSelector(
  selectUserFeature,
  (state) => state.currentUserId
);

export const selectUserLoading = createSelector(
  selectUserFeature,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserFeature,
  (state) => state.error
);

export const selectUserFilters = createSelector(
  selectUserFeature,
  (state) => state.filters
);

// ============================================
// COMPOSED SELECTORS - Building on base selectors
// ============================================

export const selectAllUsers = createSelector(
  selectUserEntities,
  selectUserIds,
  (entities, ids) => ids.map((id) => entities[id])
);

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (entities, currentId) => (currentId ? entities[currentId] : null)
);

export const selectAdminUsers = createSelector(
  selectAllUsers,
  (users) => users.filter((user) => user.role === 'admin')
);

export const selectUserCount = createSelector(
  selectAllUsers,
  (users) => users.length
);

// ============================================
// PARAMETERIZED SELECTORS - Accept parameters
// ============================================

export const selectUserById = createSelector(
  selectUserEntities,
  (entities, props: { id: string }) => entities[props.id] || null
);

export const selectUsersByRole = createSelector(
  selectAllUsers,
  (users, props: { role: 'admin' | 'user' }) =>
    users.filter((user) => user.role === props.role)
);

export const selectUsersBySearchTerm = createSelector(
  selectAllUsers,
  (users, props: { searchTerm: string }) => {
    const term = props.searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }
);

// ============================================
// DERIVED COMPUTATIONS - Complex selectors
// ============================================

export const selectUserStatistics = createSelector(
  selectAllUsers,
  (users) => ({
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    regularUsers: users.filter((u) => u.role === 'user').length,
    averageCreatedDate: users.length
      ? new Date(
          users.reduce((sum, u) => sum + new Date(u.createdAt).getTime(), 0) /
            users.length
        )
      : null,
  })
);

export const selectFilteredAndSortedUsers = createSelector(
  selectAllUsers,
  selectUserFilters,
  (users, filters) => {
    let result = users;

    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter((user) => user.role === filters.role);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'created':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }
);

// ============================================
// USAGE IN COMPONENTS
// ============================================

/*
// Inject store
constructor(private store: Store<AppState>) {}

// Observable selectors
ngOnInit(): void {
  // Simple selector
  this.store.select(selectAllUsers).subscribe(users => {
    console.log(users);
  });

  // With pipe async
  users$ = this.store.select(selectAllUsers);

  // Parameterized selector
  this.store.select(selectUserById, { id: 'user-123' }).subscribe(...);

  // Complex selector
  this.store.select(selectFilteredAndSortedUsers).subscribe(...);
}

// In template
<ng-container *ngIf="users$ | async as users">
  <div *ngFor="let user of users">{{ user.name }}</div>
</ng-container>
*/

// ============================================
// SELECTOR BENEFITS
// ============================================

/*
1. MEMOIZATION
   - Same inputs = same output (cached)
   - Component only re-renders on actual data change
   - Reduces unnecessary change detection

2. COMPOSITION
   - Build complex selectors from simple ones
   - Reuse selectors across components
   - Single source of truth for computations

3. PERFORMANCE
   - Lazy evaluation (only computed when subscribed)
   - Can use in smart selectors for complex operations
   - Prevents duplicate computations

4. TESTABILITY
   - Pure functions, easy to test
   - No side effects
   - Can test selectors independently

5. MAINTAINABILITY
   - Centralized data access logic
   - Clear data dependencies
   - Easy to refactor state structure
*/
