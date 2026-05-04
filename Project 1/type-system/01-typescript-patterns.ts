/**
 * TYPE SYSTEM PATTERNS - TypeScript Best Practices
 * 
 * Strong typing reduces bugs and improves IDE support.
 * Reusable generic types for consistency.
 * Discriminated unions for type-safe patterns.
 */

// ============================================
// GENERIC TYPES - Reusable Across Features
// ============================================

/**
 * Generic API Response wrapper
 * Use for all API calls to ensure consistency
 */
export interface ApiResponse<TData, TError = string> {
  success: boolean;
  data: TData;
  error?: TError;
  message: string;
  timestamp: string;
  statusCode: number;
}

/**
 * Generic Paginated Response
 */
export interface PaginatedResponse<TItem> {
  items: TItem[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic Request Parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generic Response with Metadata
 */
export interface DataWithMetadata<TData, TMeta = Record<string, unknown>> {
  data: TData;
  metadata: TMeta;
}

// ============================================
// ACTION PAYLOAD TYPES
// ============================================

/**
 * Standard action payload structure
 * Ensures all actions follow the same pattern
 */
export interface ActionPayload<TPayload> {
  type: string;
  payload: TPayload;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Type-safe success/failure pattern
 */
export type AsyncActionResult<TSuccess, TError = string> =
  | { success: true; data: TSuccess }
  | { success: false; error: TError };

// ============================================
// STATE MANAGEMENT TYPES
// ============================================

/**
 * Generic Entity State
 * For managing normalized entities
 */
export interface EntityState<TEntity extends { id: string }> {
  entities: Record<string, TEntity>;
  ids: string[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Async State wrapper
 * Captures loading/error states
 */
export interface AsyncState<TData> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: TData | null;
}

/**
 * Filter/Sort parameters type
 */
export interface FilterParams<TEntity> {
  filters: Partial<TEntity>;
  sortBy: keyof TEntity;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

// ============================================
// DISCRIMINATED UNIONS - Type-Safe Pattern Matching
// ============================================

/**
 * Discriminated union for HTTP request states
 * Only relevant properties available at each stage
 */
export type HttpState<TData> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };

/**
 * Discriminated union for form states
 */
export type FormState<TData> =
  | { state: 'pristine'; data: TData }
  | { state: 'dirty'; data: TData; changes: Partial<TData> }
  | { state: 'submitting'; data: TData; changes: Partial<TData> }
  | { state: 'error'; data: TData; changes: Partial<TData>; error: string }
  | { state: 'success'; data: TData };

// Usage example:
/*
function handleFormState<T>(formState: FormState<T>): void {
  switch (formState.state) {
    case 'pristine':
      console.log('Form not modified');
      break;
    case 'dirty':
      console.log('Form has changes:', formState.changes);
      break;
    case 'submitting':
      console.log('Sending changes:', formState.changes);
      break;
    case 'error':
      console.error('Form error:', formState.error);
      break;
    case 'success':
      console.log('Form saved:', formState.data);
      break;
  }
}
*/

/**
 * Result type - Similar to Rust's Result<T, E>
 */
export type Result<TSuccess, TError = Error> =
  | { ok: true; value: TSuccess }
  | { ok: false; error: TError };

// Usage:
/*
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
*/

// ============================================
// DOMAIN MODELS - Entity Types
// ============================================

/**
 * User domain model
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  avatar: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string;
  emailVerified: boolean;
}

/**
 * Create DTO - Subset of User for creation
 */
export type CreateUserDto = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'emailVerified'
>;

/**
 * Update DTO - All fields optional
 */
export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Public User view - Safe to send to client
 */
export type UserPublicView = Omit<User, 'emailVerified'>;

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Make all properties of a type required and not nullable
 */
export type Defined<T> = {
  [K in keyof T]-?: Exclude<T[K], null | undefined>;
};

/**
 * Extract value type from array type
 */
// Usage: type Items = ArrayElement<string[]>; // string
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (
  infer U
)[]
  ? U
  : never;

/**
 * Create a type from an object's values
 */
// Usage: type Colors = ObjectValues<typeof colors>;
export type ObjectValues<T> = T[keyof T];

/**
 * Create a readonly version of a type
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * Exclude keys from a type
 */
export type Exclude<T, K extends keyof T> = Omit<T, K>;

/**
 * Only include certain keys
 */
export type Include<T, K extends keyof T> = Pick<T, K>;

// ============================================
// FUNCTION TYPES
// ============================================

/**
 * Type-safe event emitter callback
 */
export type EventHandler<T> = (event: T) => void;

/**
 * Type-safe comparator function
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Type-safe mapper function
 */
export type Mapper<TInput, TOutput> = (input: TInput) => TOutput;

/**
 * Type-safe filter predicate
 */
export type Predicate<T> = (value: T) => boolean;

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
  - Create generic reusable types
  - Use discriminated unions for complex states
  - Use Omit/Pick for creating DTOs from models
  - Type function parameters and returns
  - Use 'as const' for literal types
  - Create branded types for different uses
  - Document complex types with comments

❌ DON'T:
  - Use 'any' (defeats TypeScript purpose)
  - Create type for every variable (inference is ok)
  - Over-engineer types
  - Mix generic and specific in same type
  - Forget about null/undefined handling
  - Use 'object' type (use Record instead)
*/

// ============================================
// BRANDED TYPES - Type-Safe IDs
// ============================================

/**
 * Branded type prevents mixing different ID types
 */
export type UserId = string & { readonly brand: 'UserId' };
export type PostId = string & { readonly brand: 'PostId' };

// Helper to create branded types
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createPostId(id: string): PostId {
  return id as PostId;
}

/*
Usage:
const userId: UserId = createUserId('123');
const postId: PostId = createPostId('456');

// This will cause TypeScript error - can't mix IDs
function getPost(id: PostId): Post { }
getPost(userId); // ❌ Error: Type 'UserId' is not assignable to type 'PostId'

// But this is ok:
getPost(postId); // ✅ OK
*/
