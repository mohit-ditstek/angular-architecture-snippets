/**
 * APPLICATION CONFIGURATION - Setup & Initialization
 * 
 * Central place for app providers, interceptors, factory functions.
 * Runs before app bootstrap.
 */

import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore, metaReducers } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { environment } from './environments/environment';
import { appRoutes } from './app.routes';
import { appReducers } from './store/app/app.reducers';
import { AppEffects } from './store/app/app.effects';
import { 
  authTokenInterceptor,
  requestInterceptor,
  errorInterceptor 
} from './core/interceptors';
import { 
  STORE_CONFIG,
  metaReducerConfig 
} from './store/app/store.config';

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Initialize icon registry with SVG icons
 * Runs on app startup before rendering
 */
export function initializeIcons(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
): () => void {
  return () => {
    // Register icons from SVG assets
    matIconRegistry.addSvgIcon(
      'home',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/home.svg')
    );
    matIconRegistry.addSvgIcon(
      'settings',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg')
    );
    matIconRegistry.addSvgIcon(
      'logout',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logout.svg')
    );

    // Set default icon size
    matIconRegistry.setDefaultFontSetClass('material-icons');
  };
}

/**
 * Initialize authentication
 * Check stored token and verify user session
 */
export function initializeAuth(
  authService: AuthService,
  store: Store
): () => Promise<void> {
  return () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Verify token is still valid
      return authService.verifyToken(token).toPromise().then(
        (response) => {
          store.dispatch(setUserAction({ user: response.user }));
        },
        (error) => {
          console.warn('Token verification failed:', error);
          localStorage.removeItem('accessToken');
        }
      );
    }

    return Promise.resolve();
  };
}

/**
 * Initialize translations
 * Load i18n files
 */
function translateLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

// ============================================
// APPLICATION CONFIGURATION
// ============================================

export const appConfig: ApplicationConfig = {
  providers: [
    // ========== ROUTING ==========
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules) // Preload lazy modules in background
    ),

    // ========== STATE MANAGEMENT (NgRx) ==========
    provideStore(appReducers, {
      initialState: STORE_CONFIG.initialState,
      metaReducers: metaReducerConfig,
      runtimeChecks: {
        // Strict mode checks
        strictStateImmutability: !environment.production,
        strictActionImmutability: !environment.production,
        strictStateSerializability: !environment.production,
        strictActionSerializability: !environment.production,
      },
    }),

    provideEffects([AppEffects]),

    // Redux DevTools - Only in development
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),

    // ========== HTTP & INTERCEPTORS ==========
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,
        requestInterceptor,
        errorInterceptor,
      ])
    ),

    // ========== FEATURE MODULES ==========
    importProvidersFrom([
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),

    // ========== INITIALIZATION TOKENS ==========
    // These run before app bootstrap
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcons,
      deps: [MatIconRegistry, DomSanitizer],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService, Store],
      multi: true,
    },

    // ========== SERVICES ==========
    // These are provided at root, injectable anywhere
    AuthService,
    HttpService,
    IconService,
    AnalyticsService,
  ],
};

// ============================================
// FEATURE MODULE PROVIDERS
// ============================================

/*
For feature-specific setup, provide at route level:

routes: [
  {
    path: 'users',
    component: UsersComponent,
    providers: [
      // State management for this feature
      provideState(StateFeatureKey.Users, usersReducer),
      provideEffects([UsersEffects]),
      
      // Feature-specific services
      UserService,
      UserFacade,
    ]
  }
]
*/

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

/*
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  firebase: {
    projectId: 'dev-project',
  },
  logging: true,
  debugMode: true,
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  firebase: {
    projectId: 'prod-project',
  },
  logging: false,
  debugMode: false,
};
*/

// ============================================
// BOOTSTRAP APPLICATION
// ============================================

/*
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use APP_INITIALIZER for startup logic
  - Group providers by concern
  - Use environment for configuration
  - Lazy load features via routes
  - Provide services at appropriate level
  - Import only needed modules
  - Use metaReducers for cross-cutting concerns

❌ DON'T:
  - Init app state in AppComponent constructor
  - Provide services multiple times
  - Import all modules upfront
  - Skip error handling in initializers
  - Make initializers do too much
  - Use global singletons for state
*/
