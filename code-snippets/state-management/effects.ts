/**
 * EFFECTS PATTERN - Side Effect Management
 * 
 * Effects intercept actions, perform side effects (HTTP, navigation, etc),
 * and dispatch new actions with results. They listen to actions and react.
 * Keeps reducers pure by handling side effects outside the store.
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  switchMap,
  map,
  catchError,
  exhaustMap,
  mergeMap,
  debounceTime,
  distinctUntilChanged,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';

// ============================================
// EXAMPLE: USER EFFECTS
// ============================================

@Injectable()
export class UserEffects {
  /**
   * Load Users Effect
   * 
   * Triggered by: loadUsers action
   * Side effect: HTTP request
   * Success result: loadUsersSuccess with users data
   * Failure result: loadUsersFailure with error
   */
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({ filters }) =>
        this.userService.getUsers(filters).pipe(
          map((response) =>
            UserActions.loadUsersSuccess({
              users: response.data,
              metadata: response.metadata,
            })
          ),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Search Users Effect - DEBOUNCED to reduce API calls
   * 
   * {dispatch: true} is implicit here (default)
   * Waits 500ms after last search input before making API call
   */
  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.searchUsers),
      debounceTime(500),
      distinctUntilChanged((prev, curr) => prev.searchTerm === curr.searchTerm),
      switchMap(({ searchTerm }) =>
        this.userService.searchUsers(searchTerm).pipe(
          map((results) =>
            UserActions.searchUsersSuccess({ results })
          ),
          catchError((error) =>
            of(UserActions.searchUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Update User Effect - EXHAUSTMAP for login-like operations
   * 
   * exhaustMap: Ignores subsequent calls while one is running
   * Prevents duplicate requests if user clicks button multiple times
   */
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      exhaustMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map((updatedUser) =>
            UserActions.updateUserSuccess({ user: updatedUser })
          ),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Delete User Effect - With additional side effect
   * 
   * After successful deletion, navigate to users list
   */
  deleteUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.deleteUser),
        switchMap(({ userId }) =>
          this.userService.deleteUser(userId).pipe(
            tap(() => this.router.navigate(['/users'])),
            catchError((error) => {
              this.toastr.error(error.message);
              return EMPTY; // Don't dispatch action
            })
          )
        )
      ),
    { dispatch: false } // No action dispatch
  );

  /**
   * Load User Success Side Effect
   * 
   * When users successfully load, show success message
   * Demonstrates handling success with side effect
   */
  loadUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loadUsersSuccess),
        tap((action) => {
          this.toastr.success(`Loaded ${action.users.length} users`);
        })
      ),
    { dispatch: false }
  );

  /**
   * Load User Failure Side Effect
   * 
   * When users fail to load, show error message
   */
  loadUsersFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loadUsersFailure),
        tap(({ error }) => {
          this.toastr.error('Failed to load users: ' + error);
        })
      ),
    { dispatch: false }
  );

  /**
   * Complex Effect with Multiple Actions
   * 
   * MERGEMAPS: Allows concurrent operations
   * Can dispatch multiple actions, dispatch subsequent actions, and continue handling
   */
  bulkUpdateUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.bulkUpdateUsers),
      mergeMap(({ userIds, updates }) =>
        this.userService.bulkUpdateUsers(userIds, updates).pipe(
          switchMap((results) => [
            UserActions.bulkUpdateUsersSuccess({ results }),
            UserActions.updateCache(), // Additional action
          ]),
          catchError((error) =>
            of(UserActions.bulkUpdateUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Effect with State Dependency
   * 
   * Uses withLatestFrom to get current state
   * Can make decisions based on current state
   */
  conditionalUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([action, currentUser]) => {
        // Only update if current user has admin role
        if (currentUser?.role !== 'admin') {
          return of(UserActions.updateUserFailure({ 
            error: 'Unauthorized' 
          }));
        }

        return this.userService.updateUser(action.user).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => 
            of(UserActions.updateUserFailure({ error: error.message }))
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {}
}

// ============================================
// OPERATOR GUIDE
// ============================================

/*
SWITCHMAP: Cancel previous request if new action comes
  - Use for: search, filters, when only latest matters
  - Unsubscribes from previous observable
  - Memory efficient for frequent updates

EXHAUSTMAP: Ignore new actions while one is processing
  - Use for: login, API calls that shouldn't repeat
  - Prevents duplicate submissions
  - Waits for current request to complete

MERGEMAP: Run all requests concurrently
  - Use for: independent operations, bulk operations
  - Can handle rate limiting delays
  - All requests run in parallel

CONCATMAP: Run sequentially in order
  - Use for: operations that must run in order
  - Waits for each to complete before next
  - Maintains order

FLATMAP: Alias for MERGEMAP
  - Same behavior as mergeMap
*/

// ============================================
// DISPATCH STRATEGIES
// ============================================

/*
1. Successful Effect
   loadUsers$ = createEffect(() =>
     this.actions$.pipe(
       ofType(loadUsers),
       switchMap(() => 
         this.service.load().pipe(
           map(data => loadUsersSuccess({ data }))
         )
       )
     )
   );

2. With Error Handling
   loadUsers$ = createEffect(() =>
     this.actions$.pipe(
       ofType(loadUsers),
       switchMap(() => 
         this.service.load().pipe(
           map(data => loadUsersSuccess({ data })),
           catchError(err => of(loadUsersFailure({ error: err })))
         )
       )
     )
   );

3. Side Effect Only (No Dispatch)
   logAction$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(someAction),
         tap(action => console.log(action))
       ),
     { dispatch: false }
   );

4. Multiple Dispatches
   deleteAndRefresh$ = createEffect(() =>
     this.actions$.pipe(
       ofType(deleteUser),
       switchMap(() => 
         this.service.delete().pipe(
           switchMap(() => [
             deleteUserSuccess(),
             loadUsers()  // Trigger refresh
           ])
         )
       )
     )
   );
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use switchMap for search/filter (cancel old requests)
  - Use exhaustMap for login/critical operations
  - Handle errors with catchError
  - Include proper error messages
  - Use tap only for side effects (logging, navigation)
  - Add timeouts to prevent hanging
  - Test effects with marbles

❌ DON'T:
  - Put business logic in effects (use services)
  - Subscribe to observables (always compose)
  - Forget error handling (catchError always!)
  - Use effects for state-only logic (use reducers)
  - Make effects too complex (break into smaller ones)
  - Forget { dispatch: false } for side-effect-only effects
*/
