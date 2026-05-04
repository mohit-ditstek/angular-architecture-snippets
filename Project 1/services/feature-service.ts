/**
 * FEATURE SERVICE - Business Logic Layer
 * 
 * Feature services wrap the generic HTTP service and add domain-specific logic.
 * They provide a clean API for components and effects to interact with data.
 * Single responsibility: Business logic for a specific feature.
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpService, PaginatedResponse } from './http.service';

// ============================================
// DOMAIN MODELS
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}

export interface UserSearchParams {
  query?: string;
  role?: string;
  page?: number;
  size?: number;
}

// ============================================
// FEATURE SERVICE
// ============================================

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Cache for user list
   * Using BehaviorSubject for reactive caching
   */
  private userCache$ = new BehaviorSubject<User[] | null>(null);
  public cache$ = this.userCache$.asObservable();

  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private lastCacheTime = 0;

  constructor(private http: HttpService) {}

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Get all users with caching
   * Returns cached data if available and not expired
   */
  getUsers(): Observable<User[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (
      this.userCache$.value &&
      now - this.lastCacheTime < this.cacheExpiry
    ) {
      return this.cache$;
    }

    return this.http.get<User[]>('users').pipe(
      tap((users) => {
        this.userCache$.next(users);
        this.lastCacheTime = now;
      }),
      shareReplay(1) // Share the result among multiple subscribers
    );
  }

  /**
   * Get paginated users
   */
  getUsersPaginated(
    page: number = 1,
    size: number = 10
  ): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>('users', {
      params: { page, size }
    });
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`users/${id}`);
  }

  /**
   * Search users with optional filters
   */
  searchUsers(params: UserSearchParams): Observable<User[]> {
    // Build query string from parameters
    const httpParams = this.buildSearchParams(params);

    return this.http.get<User[]>('users/search', {
      params: httpParams
    });
  }

  /**
   * Create new user
   */
  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<CreateUserDto, User>('users', dto).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /**
   * Update user
   */
  updateUser(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.put<UpdateUserDto, User>(`users/${id}`, dto).pipe(
      tap((updatedUser) => this.updateCachedUser(updatedUser))
    );
  }

  /**
   * Delete user
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`users/${id}`).pipe(
      tap(() => this.removeCachedUser(id))
    );
  }

  /**
   * Bulk operations
   */
  bulkDeleteUsers(ids: string[]): Observable<{ deleted: number }> {
    return this.http.post<{ ids: string[] }, { deleted: number }>(
      'users/bulk-delete',
      { ids }
    ).pipe(
      tap(() => this.invalidateCache())
    );
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  /**
   * Transform search parameters to HTTP params
   */
  private buildSearchParams(params: UserSearchParams): Record<string, any> {
    return {
      q: params.query || undefined,
      role: params.role || undefined,
      page: params.page || 1,
      size: params.size || 10,
    };
  }

  /**
   * Invalidate cache
   */
  private invalidateCache(): void {
    this.userCache$.next(null);
    this.lastCacheTime = 0;
  }

  /**
   * Update single user in cache
   */
  private updateCachedUser(updatedUser: User): void {
    const current = this.userCache$.value;
    if (current) {
      const updated = current.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      this.userCache$.next(updated);
    }
  }

  /**
   * Remove user from cache
   */
  private removeCachedUser(id: string): void {
    const current = this.userCache$.value;
    if (current) {
      const updated = current.filter((user) => user.id !== id);
      this.userCache$.next(updated);
    }
  }
}

// ============================================
// USAGE IN EFFECTS
// ============================================

/*
@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(error => of(loadUsersFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
*/

// ============================================
// USAGE IN COMPONENTS
// ============================================

/*
export class UserListComponent implements OnInit {
  users$ = this.userService.getUsers();
  loading$ = new BehaviorSubject(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading$.next(true);
    this.users$.subscribe(
      () => this.loading$.next(false),
      () => this.loading$.next(false)
    );
  }

  searchUsers(query: string): void {
    this.users$ = this.userService.searchUsers({ query });
  }
}
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use Observable return types
  - Implement caching where appropriate
  - Share expensive operations with shareReplay
  - Invalidate cache on mutations
  - Use tap() for side effects only
  - Add error handling in effects, not services
  - Keep services focused on one domain

❌ DON'T:
  - Subscribe in services (compose, don't subscribe)
  - Put UI logic in services (toasts, navigation)
  - Make services depend on other services deep chains
  - Ignore error responses
  - Mock HTTP in services (mock HttpClient in tests)
  - Service directly calling component methods
*/
