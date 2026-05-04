/**
 * AUTHENTICATION GUARD - Protect Routes
 * 
 * Guards prevent unauthorized access to routes.
 * Modern function-based guards (not class-based).
 * Returns boolean or Observable<boolean> to allow/deny navigation.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

// ============================================
// STATE & SELECTORS
// ============================================

interface AuthState {
  user: User | null;
  token: string | null;
  isVerified: boolean;
  loading: boolean;
}

interface User {
  id: string;
  role: 'admin' | 'user';
  email: string;
}

// Selector to get current user
export const selectCurrentUser = () => {}; // Implementation omitted
export const selectAuthToken = () => {}; // Implementation omitted
export const selectIsAuthenticated = () => {}; // Implementation omitted

// ============================================
// AUTHENTICATION GUARD
// ============================================

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  store: Store = inject(Store),
  router: Router = inject(Router)
) => {
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true; // Allow navigation
      } else {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url } // Save where user was trying to go
        });
        return false; // Deny navigation
      }
    })
  );
};

// ============================================
// ROLE-BASED GUARD
// ============================================

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  store: Store = inject(Store),
  router: Router = inject(Router)
) => {
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No role requirement
  }

  return store.select(selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (user && requiredRoles.includes(user.role)) {
        return true;
      }

      // Redirect to unauthorized page or login
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};

// ============================================
// COMPLEX GUARD - Multiple Conditions
// ============================================

export const complexAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  store: Store = inject(Store),
  router: Router = inject(Router)
) => {
  return combineLatest([
    store.select(selectCurrentUser),
    store.select(selectAuthToken),
  ]).pipe(
    take(1),
    map(([user, token]) => {
      // Check 1: User exists
      if (!user) {
        router.navigate(['/login']);
        return false;
      }

      // Check 2: Token exists
      if (!token) {
        router.navigate(['/login']);
        return false;
      }

      // Check 3: Token not expired
      if (isTokenExpired(token)) {
        router.navigate(['/login']);
        return false;
      }

      // Check 4: User verified
      const requiredVerified = route.data['requireVerified'];
      if (requiredVerified && !user.emailVerified) {
        router.navigate(['/verify-email']);
        return false;
      }

      return true;
    })
  );
};

// ============================================
// DEACTIVATE GUARD - Prevent unsaved changes
// ============================================

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

// ============================================
// USAGE IN ROUTES
// ============================================

/*
routes: [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'secure',
    component: SecureComponent,
    canActivate: [complexAuthGuard],
    data: { requireVerified: true }
  }
]
*/

// ============================================
// HELPER FUNCTIONS
// ============================================

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Invalid token = expired
  }
}

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use guards to prevent unauthorized navigation
  - Return early when denying (before any async operations)
  - Save return URL for login redirect
  - Save required data in route.data
  - Use take(1) to complete observable
  - Provide clear error messages
  - Combine multiple guards for complex logic

❌ DON'T:
  - Subscribe in guards (use map/tap and return)
  - Make guards too complex (split into multiple)
  - Forget to return false (always return boolean/observable)
  - Call router.navigate() in every scenario
  - Have side effects in guards (only navigation)
*/
