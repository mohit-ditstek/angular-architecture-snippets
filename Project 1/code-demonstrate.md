# Code Snippets - Best Practices Guide

This folder contains curated code examples demonstrating architectural patterns and best practices.

## 📁 Folder Structure

### 1. **state-management** - NgRx Pattern Implementation
   - Feature-based store architecture
   - Actions, reducers, selectors, and effects
   - Facade pattern for simplified component access
   - Meta-reducers for state persistence

### 2. **services** - Service Layer Architecture
   - Generic HTTP service with typed generics
   - Domain-specific services wrapping HTTP calls
   - Singleton pattern with `providedIn: 'root'`
   - Observable-based return types

### 3. **guards-interceptors** - Route Protection & HTTP Handling
   - Authentication guards
   - Token management interceptors
   - Request/response interceptors
   - Error handling in interceptor chains

### 4. **components** - Component Structure & Patterns
   - Standalone component setup
   - Smart vs. presentational components
   - Form handling with strong typing
   - Template composition

### 5. **routing** - Route Configuration
   - Lazy loading with feature modules
   - Provider injection at route level
   - Protected routes with guards
   - Nested routing structure

### 6. **configuration** - Application Setup
   - App initialization with `APP_INITIALIZER`
   - Provider configuration
   - Multi-interceptor chain setup
   - Icon registry initialization

### 7. **type-system** - TypeScript Patterns
   - Generic interfaces for reusable types
   - Type-safe API responses
   - Discriminated unions
   - Barrel exports for clean imports

## 🎯 Key Takeaways

✅ **Separation of Concerns** - Clear boundaries between components, services, and state  
✅ **Type Safety** - Strict typing with generics and discriminated unions  
✅ **Scalability** - Feature-based organization for large applications  
✅ **Reusability** - Generic types and services that work across features  
✅ **Performance** - Memoized selectors, lazy loading, tree-shaking friendly  
✅ **Maintainability** - Single source of truth for data and configuration  

## 💡 Design Patterns Used

1. **Facade Pattern** - Simplify store interaction for components
2. **Strategy Pattern** - Different error handling strategies
3. **Factory Pattern** - Service creation with dependency injection
4. **Observer Pattern** - RxJS observables throughout
5. **Singleton Pattern** - Global services with `providedIn: 'root'`
6. **Repository Pattern** - Services as data access layer

