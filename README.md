# Code Snippets Reference

A comprehensive collection of production-ready code patterns and best practices.

## 📚 Contents Overview

### 1. **State Management** (`state-management/`)
Modern Redux/NgRx patterns for scalable state management.

- **Facade Pattern** - Simplify store interaction in components
- **Actions** - Event-driven architecture with strongly typed payloads
- **Reducers** - Pure functions for immutable state updates
- **Selectors** - Memoized, efficient state queries
- **Effects** - Side effect management for HTTP and async operations

**Key Concepts:**
- Feature-based store organization
- Normalized state for performance
- Memoized selectors prevent unnecessary re-renders
- Effects handle all async operations

---

### 2. **Services** (`services/`)
Clean service layer architecture with separation of concerns.

- **Generic HTTP Service** - Reusable, type-safe HTTP wrapper
- **Feature Service** - Domain-specific business logic layer

**Key Concepts:**
- Observable-based (no auto-subscription)
- Singleton pattern with `providedIn: 'root'`
- Caching strategies
- Type-safe requests and responses
- Single responsibility principle

**Example Usage:**
```typescript
// HTTP service (framework-independent)
this.http.get<User[]>('users').subscribe(users => { });

// Feature service (domain-specific)
this.userService.getUsers().subscribe(users => { });
this.userService.createUser(dto).subscribe(user => { });
```

---

### 3. **Guards & Interceptors** (`guards-interceptors/`)
Route protection and HTTP middleware.

- **Authentication Guard** - Protect routes from unauthorized access
- **Interceptor Patterns** - HTTP middleware for requests/responses

**Guard Types:**
- `CanActivate` - Control route access
- `CanDeactivate` - Prevent losing unsaved changes
- Role-based access control
- Complex multi-condition guards

**Interceptor Patterns:**
- Auth token injection and refresh
- Request/response logging
- Centralized error handling
- Request header manipulation

---

### 4. **Components** (`components/`)
Standalone component architecture with modern patterns.

- **Smart vs Presentational** - Clear separation of concerns
- **Reactive Forms** - Type-safe form handling
- **Component Composition** - Build complex UIs from simple parts

**Architecture:**
```
Smart Component (Container)
  ↓
  ├─ State/Store
  ├─ Services
  └─ Presentational Component
       ↓
       ├─ @Input (data in)
       ├─ @Output (events out)
       └─ Template (UI only)
```

**Key Features:**
- Standalone components (no NgModule)
- Explicit imports (tree-shaking friendly)
- Strong typing with interfaces
- Proper lifecycle management
- Observable subscriptions with automatic cleanup

---

### 5. **Routing** (`routing/`)
Feature-based route organization with lazy loading.

- **App Routes** - Main application routing
- **Feature Routes** - Nested, lazy-loaded routes
- **Route Guards** - Protect routes with canActivate
- **Programmatic Navigation** - Router-based navigation

**Route Structure:**
```
App Routes
├─ Dashboard (protected)
├─ Authentication (lazy)
│  ├─ Login
│  ├─ Signup
│  └─ Forgot Password
├─ Users (lazy, protected)
│  ├─ List
│  ├─ Detail
│  └─ Edit (with unsaved changes guard)
└─ Admin (lazy, role-protected)
   ├─ Users
   ├─ Settings
   └─ Reports
```

**Benefits:**
- Lazy loading reduces initial bundle
- Feature modules load only when needed
- Guards protect sensitive routes
- Nested routing for organization

---

### 6. **Configuration** (`configuration/`)
Application setup, initialization, and provider configuration.

- **App Configuration** - Provider setup
- **Initialization Tokens** - APP_INITIALIZER for startup logic
- **Feature Modules** - Lazy-loaded feature setup
- **Environment Configuration** - Environment-specific settings

**Startup Sequence:**
1. Providers configured
2. APP_INITIALIZER functions run
3. App bootstrap
4. Route guards activated
5. Components render

---

### 7. **Type System** (`type-system/`)
TypeScript patterns for type-safe, maintainable code.

- **Generic Types** - Reusable across features
- **Discriminated Unions** - Type-safe pattern matching
- **Domain Models & DTOs** - Proper data structures
- **Utility Types** - TypeScript helpers
- **Branded Types** - Type-safe IDs

**Type Patterns:**
```typescript
// Generic API Response
ApiResponse<TData, TError>

// Discriminated Union
HttpState<T> = { status: 'idle' } | { status: 'loading' } | {...}

// Result Type (Rust-like)
Result<TSuccess, TError>

// Entity State (normalized)
EntityState<TEntity>

// DTO patterns
CreateUserDto = Omit<User, 'id' | 'createdAt' | ...>
UpdateUserDto = Partial<Omit<User, ...>>
```

---

## 🎯 Quick Start Examples

### Fetch Users (Store)
```typescript
// In component
users$ = this.facade.users$;
loading$ = this.facade.loading$;

ngOnInit() {
  this.facade.loadUsers(); // Triggers store action
}

// In template
<div *ngIf="loading$ | async">Loading...</div>
<ul>
  <li *ngFor="let user of users$ | async">{{ user.name }}</li>
</ul>
```

### HTTP Service
```typescript
// Generic service
this.http.get<User[]>('users').subscribe(users => {
  console.log(users); // Already extracted from response wrapper
});

// With error handling
this.http.post<CreateUserDto, User>('users', dto).pipe(
  map(user => this.userService.processUser(user)),
  catchError(error => this.handleError(error))
).subscribe(user => { });
```

### Reactive Form
```typescript
form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
});

onSubmit() {
  if (this.form.valid) {
    const user: UserFormData = this.form.value;
    this.userService.createUser(user).subscribe(
      () => this.showSuccess(),
      (error) => this.showError(error)
    );
  }
}
```

### Protected Route
```typescript
// In routes
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}

// Guard redirects to /login if not authenticated
```

---

## 💡 Key Principles

### 1. **Separation of Concerns**
- Components display UI
- Services handle data
- Store manages state
- Guards protect access

### 2. **Single Responsibility**
- Each class/function does one thing well
- Easy to understand, test, and modify
- Reusable across features

### 3. **Type Safety**
- Leverage TypeScript for compile-time checks
- Generic types for reusability
- Discriminated unions for exhaustive checks

### 4. **Scalability**
- Feature-based organization
- Lazy loading for performance
- Normalized state for large datasets
- Memoized selectors prevent re-computes

### 5. **Testability**
- Pure functions (reducers, selectors)
- Observable-based (easy to mock)
- Dependency injection
- Clear interfaces

---

## 🔄 Data Flow Architecture

```
User Action
    ↓
Component Event Handler
    ↓
Dispatch Action (Store)
    ↓
Reducer (update state)
    ↓
Effects (if async operation)
    ↓
Service (HTTP call)
    ↓
Success/Failure Action
    ↓
Reducer (update state)
    ↓
Selector emits new value
    ↓
Component re-renders (async pipe)
```

---

## 📝 Common Patterns

### Authentication Flow
1. User enters credentials on login page
2. Login component calls auth service
3. Auth service makes HTTP POST to /login
4. Interceptor adds headers
5. Success: Store user and token
6. Navigate to dashboard

### Form Submission
1. Form valid → submit button enabled
2. User clicks submit
3. Disable submit button, show loading spinner
4. Service makes API call
5. Interceptor adds auth token
6. Success: Update parent state, show success toast
7. Error: Show error toast, enable submit button

### Route Protection
1. User tries to access protected route
2. Guard checks auth state
3. If authenticated: navigate allowed
4. If not: redirect to login with return URL
5. After login: redirect to original URL

---

## 📚 File Organization

Each folder follows consistent patterns:
- **Clear naming** - File names describe content
- **Single export** - One main pattern per file
- **Examples included** - Usage examples in comments
- **Best practices** - Gotchas and recommendations
- **Complete** - Ready to adapt and use

---

## ✅ Checklist for New Features

- [ ] Create interfaces in `type-system`
- [ ] Create service in `services`
- [ ] Create store (actions, reducer, effects) in `state-management`
- [ ] Create facade for component access
- [ ] Create smart & presentational components
- [ ] Add guards if needed for routes
- [ ] Create feature routes
- [ ] Test reducer and effects
- [ ] Verify type safety throughout

---

## 🚀 Performance Tips

1. **Use memoized selectors** - Prevent unnecessary re-renders
2. **Normalize state** - O(1) lookups instead of array searches
3. **Lazy load features** - Only load when needed
4. **Use switchMap strategic ally** - Cancel old HTTP requests
5. **Cache HTTP responses** - Reduce server load
6. **Use trackBy in *ngFor** - Improve list rendering
7. **Mark components OnPush** - Manual change detection
8. **Use async pipe** - Automatic unsubscribe

---

## 🔗 Related Concepts

- **Redux Pattern** - Predictable state management
- **Reactive Programming** - RxJS observables
- **Functional Programming** - Pure functions
- **SOLID Principles** - Clean architecture
- **Design Patterns** - Reusable solutions
- **TypeScript** - Type-safe JavaScript

---



