/**
 * REDUCERS PATTERN - Pure Functions for State Updates
 * 
 * Reducers are pure functions that take the current state and an action,
 * then return a new state. They must be synchronous and have no side effects.
 */

import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

// ============================================
// STATE INTERFACE
// ============================================

export interface UserState {
  entities: Record<string, User>;
  ids: string[];
  currentUserId: string | null;
  loading: boolean;
  error: string | null;
  metadata: {
    lastFetched: number;
    totalCount: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// ============================================
// INITIAL STATE
// ============================================

export const initialUserState: UserState = {
  entities: {},
  ids: [],
  currentUserId: null,
  loading: false,
  error: null,
  metadata: {
    lastFetched: 0,
    totalCount: 0,
  },
};

// ============================================
// REDUCER - More complex example
// ============================================

export const userReducer = createReducer(
  initialUserState,

  // --- LOAD USERS ---
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, { users, metadata }) => {
    // Normalize users into entities
    const entities = users.reduce(
      (acc, user) => ({
        ...acc,
        [user.id]: user,
      }),
      {}
    );

    return {
      ...state,
      entities: { ...state.entities, ...entities },
      ids: [...new Set([...state.ids, ...users.map((u) => u.id)])], // avoid duplicates
      loading: false,
      metadata: {
        ...state.metadata,
        ...metadata,
        lastFetched: Date.now(),
      },
    };
  }),

  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // --- UPDATE USER ---
  on(UserActions.updateUserSuccess, (state, { user }) => {
    // Only update if user exists in state
    if (!state.entities[user.id]) {
      return state;
    }

    return {
      ...state,
      entities: {
        ...state.entities,
        [user.id]: { ...state.entities[user.id], ...user },
      },
    };
  }),

  // --- DELETE USER ---
  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    entities: Object.fromEntries(
      Object.entries(state.entities).filter(([id]) => id !== userId)
    ),
    ids: state.ids.filter((id) => id !== userId),
    currentUserId: state.currentUserId === userId ? null : state.currentUserId,
  })),

  // --- SELECT USER ---
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    currentUserId: userId,
  })),

  // --- RESET STATE ---
  on(UserActions.clearUserState, () => initialUserState),

  on(UserActions.resetUserError, (state) => ({
    ...state,
    error: null,
  }))
);

// ============================================
// IMMUTABILITY PATTERNS
// ============================================

/*
Pattern 1: Spread Operator (Simple Updates)
const updatedState = {
  ...state,
  loading: false,
  error: null,
};

Pattern 2: Nested Object Updates
const updatedState = {
  ...state,
  metadata: {
    ...state.metadata,
    lastFetched: Date.now(),
  },
};

Pattern 3: Entity Management (Normalization)
const entities = items.reduce(
  (acc, item) => ({
    ...acc,
    [item.id]: item,
  }),
  {}
);

const updatedState = {
  ...state,
  entities: { ...state.entities, ...entities },
};

Pattern 4: Array Operations
// Add
ids: [...state.ids, newId]

// Remove
ids: state.ids.filter(id => id !== idToRemove)

// Update
items: state.items.map(item =>
  item.id === targetId ? { ...item, ...updates } : item
)
*/

// ============================================
// NORMALIZATION PATTERN - Entity Storage
// ============================================

/*
Why normalize?
✅ O(1) lookup by ID
✅ Easy updates: entities[id] = newValue
✅ Avoid array searches
✅ Reduced memory for duplicates

Structure:
{
  entities: {
    'user-1': { id: 'user-1', name: 'John', ... },
    'user-2': { id: 'user-2', name: 'Jane', ... },
  },
  ids: ['user-1', 'user-2'],
}

vs. Non-normalized (avoid):
{
  items: [
    { id: 'user-1', name: 'John', ... },
    { id: 'user-2', name: 'Jane', ... },
  ]
}
*/

// ============================================
// PURE FUNCTION RULES
// ============================================

/*
✅ ALLOWED (Pure):
  - Spreading objects and arrays
  - Creating new objects/arrays
  - Pure array methods (map, filter, reduce)
  - Immutable updates
  - Object property access

❌ NOT ALLOWED (Impure):
  - Mutating state directly: state.user = user
  - Mutating payload: action.payload.id = 123
  - HTTP calls
  - Math.random()
  - Date mutations
  - console.log for side effects
  - setTimeout/setInterval
*/
