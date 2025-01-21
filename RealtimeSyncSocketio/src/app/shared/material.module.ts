import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

const modules = [
  MatToolbarModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatTableModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatSortModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTabsModule,
  MatGridListModule,
  MatSelectModule,
  MatRadioModule,
  MatStepperModule,
  MatBadgeModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatDividerModule,
  MatExpansionModule,
  MatProgressBarModule
];
@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
  providers: []
})
export class MaterialModule { }
