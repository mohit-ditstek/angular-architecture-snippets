/**
 * ACTIONS PATTERN - Event-Driven State Management
 * 
 * Actions represent events that happen in your application.
 * They are dispatched, then processed by reducers and effects.
 * Use createAction() with props() for payload typing.
 */

import { createAction, props } from '@ngrx/store';

// ============================================
// ACTION GROUPS - Organized by concern
// ============================================

// --- USER LOAD ACTIONS ---
export const loadUser = createAction(
  '[User] Load User',
  props<{ userId: string }>()
);

export const loadUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[User] Load User Failure',
  props<{ error: string }>()
);

// --- USER UPDATE ACTIONS ---
export const updateUser = createAction(
  '[User] Update User',
  props<{ user: Partial<User> }>()
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
);

// --- RESET ACTIONS ---
export const clearUserState = createAction(
  '[User] Clear User State'
);

export const resetUserError = createAction(
  '[User] Reset User Error'
);

// ============================================
// ACTION NAMING CONVENTION
// ============================================

/*
Pattern: [Source] Event Name

[Source] = Where the action originates
  - [Component] = triggered from component
  - [Service] = triggered from service
  - [API] = API response
  - [Route] = navigation-related
  - [FeatureName] = general feature actions

Events follow pattern:
  - Trigger: verb (Load, Update, Delete, Search)
  - Success: "{Trigger} Success"
  - Failure: "{Trigger} Failure"

Example flow:
1. [Component] Delete Item -> loadDeleteItemsAction()
2. [API Delete Items Effect] -> effects handle side effect
3. [API Delete Items] Delete Items Success -> deleteItemsSuccessAction()
   OR [API Delete Items] Delete Items Failure -> deleteItemsFailureAction()
*/

// ============================================
// STRONGLY TYPED PAYLOADS
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

export const performComplexOperation = createAction(
  '[Feature] Perform Complex Operation',
  props<{
    operationData: {
      ids: string[];
      filters: Record<string, any>;
      options: {
        skipCache: boolean;
        timeout: number;
      };
    };
  }>()
);

export const complexOperationSuccess = createAction(
  '[API Feature] Complex Operation Success',
  props<{
    results: any[];
    metadata: {
      totalCount: number;
      executionTime: number;
    };
  }>()
);

export const complexOperationFailure = createAction(
  '[API Feature] Complex Operation Failure',
  props<{ error: ApiError }>()
);

// ============================================
// DISPATCH PATTERNS IN COMPONENTS
// ============================================

/*
// Pattern 1: Via Facade (RECOMMENDED)
constructor(private facade: UserFacade) {}

loadUser(id: string): void {
  this.facade.loadUser(id);
}

// Pattern 2: Direct store dispatch (for custom logic)
constructor(private store: Store) {}

onDeleteItems(ids: string[]): void {
  this.store.dispatch(deleteItems({ ids }));
}

// Pattern 3: In effects (side effects)
loadUser$ = this.actions$.pipe(
  ofType(loadUser),
  switchMap(({ userId }) => 
    this.userService.getUser(userId).pipe(
      map(user => loadUserSuccess({ user })),
      catchError(error => of(loadUserFailure({ error })))
    )
  )
);
*/

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Use descriptive action names
  - Group related actions
  - Include source in brackets [Source]
  - Use props() for type-safe payloads
  - Create separate Success/Failure actions
  - Keep payloads simple and serializable
  - Use discriminated unions for complex payloads

❌ DON'T:
  - Vague names like "Update", "Handle", "Modify"
  - Pass entire objects when you only need IDs
  - Mix multiple concerns in one action
  - Use nested objects unless necessary
  - Dispatch actions directly from components (use facade)
*/
