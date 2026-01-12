/**
 * GENERIC HTTP SERVICE - Reusable, Type-Safe HTTP Layer
 * 
 * Provides a generic wrapper around HttpClient for consistent API communication.
 * Handles errors, request formatting, and response transformation.
 * Single responsibility: HTTP communication only.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

// ============================================
// GENERIC INTERFACES
// ============================================

/**
 * Generic API Response wrapper
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  skipErrorHandling?: boolean;
  timeout?: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// GENERIC HTTP SERVICE
// ============================================

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET request with full type safety
   * @param endpoint - API endpoint (relative to base URL)
   * @param config - Optional request configuration
   * @returns Observable of response
   * 
   * @example
   * this.http.get<User>('users/123').subscribe(user => console.log(user));
   */
  get<ResponseType>(
    endpoint: string,
    config?: RequestConfig
  ): Observable<ResponseType> {
    const url = `${this.apiUrl}/${endpoint}`;
    
    const params = this.buildHttpParams(config?.params);

    return this.http.get<ResponseType>(url, {
      params,
      headers: config?.headers,
    }).pipe(
      this.handleResponse<ResponseType>(),
      catchError((error) => this.handleError<ResponseType>(error))
    );
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param config - Optional configuration
   */
  post<RequestType, ResponseType>(
    endpoint: string,
    body: RequestType,
    config?: RequestConfig
  ): Observable<ResponseType> {
    const url = `${this.apiUrl}/${endpoint}`;
    const params = this.buildHttpParams(config?.params);

    return this.http.post<ResponseType>(url, body, {
      params,
      headers: config?.headers,
    }).pipe(
      this.handleResponse<ResponseType>(),
      catchError((error) => this.handleError<ResponseType>(error, config?.skipErrorHandling))
    );
  }

  /**
   * PUT request - Complete replacement
   */
  put<RequestType, ResponseType>(
    endpoint: string,
    body: RequestType,
    config?: RequestConfig
  ): Observable<ResponseType> {
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.put<ResponseType>(url, body, {
      headers: config?.headers,
    }).pipe(
      this.handleResponse<ResponseType>(),
      catchError((error) => this.handleError<ResponseType>(error))
    );
  }

  /**
   * PATCH request - Partial update
   */
  patch<RequestType, ResponseType>(
    endpoint: string,
    body: Partial<RequestType>,
    config?: RequestConfig
  ): Observable<ResponseType> {
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.patch<ResponseType>(url, body, {
      headers: config?.headers,
    }).pipe(
      this.handleResponse<ResponseType>(),
      catchError((error) => this.handleError<ResponseType>(error))
    );
  }

  /**
   * DELETE request
   */
  delete<ResponseType>(
    endpoint: string,
    config?: RequestConfig
  ): Observable<ResponseType> {
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.delete<ResponseType>(url, {
      headers: config?.headers,
    }).pipe(
      this.handleResponse<ResponseType>(),
      catchError((error) => this.handleError<ResponseType>(error))
    );
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Build HttpParams from object
   */
  private buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              httpParams = httpParams.append(key, v);
            });
          } else {
            httpParams = httpParams.set(key, value);
          }
        }
      });
    }

    return httpParams;
  }

  /**
   * Handle API response - Extract data from wrapper
   */
  private handleResponse<T>() {
    return map((response: ApiResponse<T>) => response.data);
  }

  /**
   * Handle HTTP errors
   */
  private handleError<T>(error: any, skipHandling?: boolean): Observable<T> {
    console.error('HTTP Error:', error);

    // Transform error to consistent format
    const errorMessage = error?.error?.message || error?.message || 'Unknown error';
    const errorResponse: ApiResponse<T> = {
      success: false,
      data: null as any,
      message: errorMessage,
      statusCode: error?.status || 500,
      timestamp: new Date().toISOString(),
    };

    if (!skipHandling) {
      this.onError(errorResponse);
    }

    throw errorResponse;
  }

  /**
   * Error handling hook - Override to customize
   */
  protected onError(error: ApiResponse<any>): void {
    // Can log to analytics, show toast, etc.
    console.error('API Error:', error.message);
  }
}

// ============================================
// USAGE IN FEATURE SERVICES
// ============================================

/*
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`users/${id}`);
  }

  searchUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>('users/search', {
      params: { q: term }
    });
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<CreateUserDto, User>('users', user);
  }

  updateUser(id: string, user: UpdateUserDto): Observable<User> {
    return this.http.put<UpdateUserDto, User>(`users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`users/${id}`);
  }

  // Paginated request
  getUsersPaginated(page: number, size: number): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>('users', {
      params: { page, size }
    });
  }
}

// In component
constructor(private userService: UserService) {}

getUser(id: string): void {
  this.userService.getUserById(id).subscribe(
    user => console.log(user),
    error => console.error(error)
  );
}
*/

// ============================================
// BENEFITS
// ============================================

/*
✅ Type Safe
   - Full TypeScript support for requests and responses
   - Compile-time checking for endpoints

✅ DRY (Don't Repeat Yourself)
   - Single place to manage API logic
   - Easy to add interceptors, error handling
   - Consistent error formatting

✅ Reusable
   - All features use same HTTP service
   - Reduces code duplication

✅ Testable
   - Easy to mock for unit tests
   - Consistent API for testing

✅ Maintainable
   - Changes in one place affect all calls
   - Easy to upgrade HTTP client
*/
