/**
 * ROUTING PATTERNS - Feature-Based Route Organization
 * 
 * Features are lazy-loaded with their own providers.
 * Routes are guarded for security.
 * Nested routing for organization.
 */

import { Routes } from '@angular/router';

// ============================================
// MAIN APPLICATION ROUTES
// ============================================

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // --- AUTHENTICATION ROUTES (Public) ---
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.routes').then(
        (m) => m.authenticationRoutes
      )
  },

  // --- DASHBOARD (Protected) ---
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard]
  },

  // --- FEATURE: USERS (Protected, Nested) ---
  {
    path: 'users',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./users/users-list/users-list.component').then(
            (m) => m.UsersListComponent
          )
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./users/user-detail/user-detail.component').then(
            (m) => m.UserDetailComponent
          )
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./users/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent
          ),
        canDeactivate: [unsavedChangesGuard]
      }
    ]
  },

  // --- FEATURE: ADMIN (Protected, Role-based) ---
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes)
  },

  // --- ERROR ROUTES ---
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./error-pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      )
  },
  {
    path: '404',
    loadComponent: () =>
      import('./error-pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      )
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

// ============================================
// FEATURE ROUTES - Authentication Example
// ============================================

export const authenticationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./authentication/authentication.component').then(
        (m) => m.AuthenticationComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./authentication/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
        data: { title: 'Login' }
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./authentication/pages/signup-page/signup-page.component').then(
            (m) => m.SignupPageComponent
          )
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./authentication/pages/forgot-password-page/forgot-password-page.component').then(
            (m) => m.ForgotPasswordPageComponent
          )
      }
    ]
  }
];

// ============================================
// FEATURE ROUTES - Admin Example
// ============================================

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/pages/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/pages/admin-settings/admin-settings.component').then(
            (m) => m.AdminSettingsComponent
          )
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/pages/admin-reports/admin-reports.component').then(
            (m) => m.AdminReportsComponent
          )
      }
    ]
  }
];

// ============================================
// ROUTE CONFIG WITH PROVIDERS
// ============================================

/*
Main app initialization with route configuration:

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideRouterStore(),
    
    // Feature providers injected at route level
    // This pattern enables lazy-loaded state management
    
    withRouteInitializerFn([
      // Initialize analytics with tracked routes
    ])
  ]
});
*/

// ============================================
// ROUTE DATA PATTERNS
// ============================================

/*
Routes can carry metadata:

{
  path: 'users',
  component: UsersComponent,
  data: {
    title: 'Users',
    description: 'Manage users',
    breadcrumb: 'Users',
    roles: ['admin', 'moderator'],
    analytics: 'users-page',
    reportId: 'user-analytics'
  }
}

Access in component:
constructor(
  private activatedRoute: ActivatedRoute
) {}

ngOnInit() {
  this.activatedRoute.data.subscribe(data => {
    console.log(data.title); // 'Users'
    document.title = data.title;
  });
}
*/

// ============================================
// PROGRAMMATIC NAVIGATION
// ============================================

/*
import { Router } from '@angular/router';

constructor(private router: Router) {}

// Simple navigation
navigateToUsers(): void {
  this.router.navigate(['/users']);
}

// With parameters
navigateToUserDetail(userId: string): void {
  this.router.navigate(['/users', userId]);
}

// With query parameters
searchUsers(query: string): void {
  this.router.navigate(['/users'], {
    queryParams: { search: query, page: 1 }
  });
}

// With fragment (anchor)
scrollToSection(): void {
  this.router.navigate(['docs'], { fragment: 'getting-started' });
}

// Replace history (no back button)
login(): void {
  this.router.navigate(['/dashboard'], { replaceUrl: true });
}

// State preservation
goToUser(user: User): void {
  this.router.navigate(['/users', user.id], {
    state: { user }
  });
}

// Access passed state
ngOnInit() {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras.state?.user) {
    this.user = navigation.extras.state.user;
  }
}
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use lazy loading for features
  - Group related routes together
  - Use pathMatch: 'full' for redirects
  - Protect routes with guards
  - Use nested routing for organization
  - Add descriptive route data
  - Use meaningful route names

❌ DON'T:
  - Load all features upfront
  - Use complex query string logic without validation
  - Forget route parameters validation
  - Leave routes unguarded
  - Create routes without data/titles
  - Navigate with hardcoded strings (use router.navigate)
  - Forget initial redirect
*/
