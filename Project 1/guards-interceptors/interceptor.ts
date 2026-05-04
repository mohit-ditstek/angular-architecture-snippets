/**
 * INTERCEPTOR PATTERNS - HTTP Middleware
 * 
 * Interceptors intercept HTTP requests and responses.
 * Use for: adding headers, handling auth, logging, error handling.
 * Modern function-based interceptors.
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  take,
  switchMap,
  finalize,
  tap,
} from 'rxjs/operators';

// ============================================
// FUNCTION-BASED INTERCEPTORS
// ============================================

/**
 * AUTH TOKEN INTERCEPTOR
 * Adds JWT token to requests
 * Handles token refresh on 401
 */
export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandler
) => {
  // Public endpoints that don't need token
  const publicEndpoints = ['/login', '/signup', '/forgot-password'];
  const isPublic = publicEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  if (isPublic) {
    return next.handle(req);
  }

  // Get token from storage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // Add token to request
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 - Token expired
      if (error.status === 401) {
        return handleTokenRefresh(req, next);
      }

      return throwError(() => error);
    })
  );
};

/**
 * REQUEST/RESPONSE INTERCEPTOR
 * Adds headers, formats requests, logs responses
 */
export const requestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandler
) => {
  // Add custom headers
  req = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-App-Version': '1.0.0',
    },
  });

  // Log outgoing request in development
  if (!environment.production) {
    console.log(`[HTTP] ${req.method} ${req.url}`, req);
  }

  return next.handle(req).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        console.log(`[HTTP] ${req.method} ${req.url} - Response:`, event);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`[HTTP Error] ${req.method} ${req.url}`, error);
      return throwError(() => error);
    })
  );
};

/**
 * ERROR HANDLING INTERCEPTOR
 * Centralized error handling
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandler
) => {
  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = extractErrorMessage(error);

      switch (error.status) {
        case 400:
          // Bad request - validation error
          console.warn('Validation error:', error.error);
          break;

        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - no permission
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.warn('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error:', errorMessage);
          break;

        default:
          console.error('Unexpected error:', errorMessage);
      }

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      }));
    })
  );
};

// ============================================
// TOKEN REFRESH LOGIC
// ============================================

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandler
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      return refreshAccessToken(refreshToken).pipe(
        switchMap((newToken: string) => {
          isRefreshing = false;
          localStorage.setItem('accessToken', newToken);
          refreshTokenSubject.next(newToken);

          // Retry original request with new token
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          return next.handle(clonedReq);
        }),
        catchError((err) => {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return throwError(() => err);
        }),
        finalize(() => {
          isRefreshing = false;
        })
      );
    }
  }

  // While refreshing, wait for new token
  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) => {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedReq);
    })
  );
}

function refreshAccessToken(refreshToken: string): Observable<string> {
  // Call refresh endpoint and return new access token
  return new Observable((observer) => {
    // Implement refresh logic
    observer.next('new-token');
    observer.complete();
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }

  if (error.error?.errors) {
    // Array of validation errors
    return Object.values(error.error.errors).flat().join(', ');
  }

  return error.message || 'An unexpected error occurred';
}

// ============================================
// PROVIDER CONFIGURATION
// ============================================

/*
// In app.config.ts or app.module.ts

import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Function-based interceptors (Angular 15+)
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useValue: requestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useValue: errorInterceptor,
      multi: true,
    },
  ],
};

// Or use provideHttpClient with interceptors
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([
        authTokenInterceptor,
        requestInterceptor,
        errorInterceptor,
      ])
    ),
  ],
});
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Keep interceptors focused (one concern each)
  - Order matters: auth → request → error
  - Handle 401 gracefully (refresh or redirect)
  - Prevent infinite retry loops
  - Use BehaviorSubject for token refresh queuing
  - Log requests in development
  - Extract error messages consistently

❌ DON'T:
  - Put business logic in interceptors
  - Subscribe directly (use operators)
  - Modify request.body directly
  - Forget to clone requests
  - Make interceptors dependent on services
  - Throw errors without context
  - Log sensitive data (tokens, passwords)
*/
