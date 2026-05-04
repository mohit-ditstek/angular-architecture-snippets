/**
 * FACADE PATTERN - State Management Simplification
 * 
 * The Facade pattern provides a simplified, unified interface to the underlying
 * store complexity. Components interact only with the facade, not directly with
 * the store, improving maintainability and reducing coupling.
 */

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Example State Interface
interface FeatureState {
  items: Item[];
  loading: boolean;
  error: string | null;
  selectedItem: Item | null;
}

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// ============================================
// FACADE SERVICE - Public API
// ============================================

@Injectable({
  providedIn: 'root'
})
export class FeatureFacade {
  /**
   * Public selectors - components use these observables
   */
  public readonly items$ = this.store.select(selectItems);
  public readonly loading$ = this.store.select(selectLoading);
  public readonly error$ = this.store.select(selectError);
  public readonly selectedItem$ = this.store.select(selectSelectedItem);

  constructor(private store: Store<{ feature: FeatureState }>) {}

  /**
   * Public actions - components call these methods instead of dispatching actions
   */
  loadItems(): void {
    this.store.dispatch(loadItemsAction());
  }

  selectItem(id: string): void {
    this.store.dispatch(selectItemAction({ id }));
  }

  updateItem(item: Item): void {
    this.store.dispatch(updateItemAction({ item }));
  }

  deleteItem(id: string): void {
    this.store.dispatch(deleteItemAction({ id }));
  }

  clearError(): void {
    this.store.dispatch(clearErrorAction());
  }
}

// ============================================
// USAGE IN COMPONENTS
// ============================================

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="loading$ | async" class="spinner">Loading...</div>
    <div *ngIf="error$ | async as error" class="error">{{ error }}</div>
    
    <button (click)="onLoadItems()">Load Items</button>
    
    <ul>
      <li *ngFor="let item of items$ | async as items">
        {{ item.name }}
        <button (click)="onSelectItem(item.id)">Select</button>
      </li>
    </ul>

    <div *ngIf="selectedItem$ | async as item" class="details">
      Selected: {{ item.name }}
    </div>
  `
})
export class ExampleComponent implements OnInit {
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;
  items$ = this.facade.items$;
  selectedItem$ = this.facade.selectedItem$;

  constructor(private facade: FeatureFacade) {}

  ngOnInit(): void {
    this.onLoadItems();
  }

  onLoadItems(): void {
    this.facade.loadItems();
  }

  onSelectItem(id: string): void {
    this.facade.selectItem(id);
  }
}

// ============================================
// BENEFITS
// ============================================

/*
1. Simplified Component Logic
   - Components only know about the facade
   - No need to understand Redux/store architecture

2. Reduced Boilerplate
   - One method to call instead of understanding actions
   - Selectors encapsulated in facade

3. Better Testability
   - Mock the facade instead of the entire store
   - Component tests are simpler

4. Easy Refactoring
   - Change store internals without affecting components
   - Update facade, components remain unchanged

5. Clear Public API
   - Only methods you expose can be used
   - Prevents accidental improper usage
*/
