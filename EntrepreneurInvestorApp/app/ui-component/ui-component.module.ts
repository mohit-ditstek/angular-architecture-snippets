import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NgxStarsModule } from 'ngx-stars';

import { TgtCardComponent } from './components/tgt-card/tgt-card.component';
import { TgtAvatarComponent } from './components/tgt-avatar/tgt-avatar.component';
import { TgtWidgetComponent } from './components/tgt-widget/tgt-widget.component';
import { TgtRightNavComponent } from './components/tgt-right-nav/tgt-right-nav.component';
import { TgtOffice365IconsComponent } from './components/tgt-office365-icons/tgt-office365-icons.component';
import { TgtEventCalendarComponent } from './components/tgt-event-calendar/tgt-event-calendar.component';
import { TgtFullWidthCardComponent } from './components/tgt-full-width-card/tgt-full-width-card.component';
import { TgtLiLeftContentComponent } from './components/tgt-li/tgt-li-left-content/tgt-li-left-content.component';
import { TgtLiRightContentComponent } from './components/tgt-li/tgt-li-right-content/tgt-li-right-content.component';
import { TgtLiTextContentComponent } from './components/tgt-li/tgt-li-text-content/tgt-li-text-content.component';
import { TgtLiContentWrapperComponent } from './components/tgt-li/tgt-li-content-wrapper/tgt-li-content-wrapper.component';
import { TgtLiComponent } from './components/tgt-li/tgt-li.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TgtLoaderComponent } from './components/tgt-loader/tgt-loader.component';
import { TgtPerfectScrollComponent } from './components/tgt-perfect-scroll/tgt-perfect-scroll.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { TgtStarRatingComponent } from './components/tgt-star-rating/tgt-star-rating.component';
import { TgtVerticalTimelineComponent } from './components/tgt-vertical-timeline/tgt-vertical-timeline.component';
import { TgtHorizontalTimelineComponent } from './components/tgt-horizontal-timeline/tgt-horizontal-timeline.component';
import { TgtHeadingComponent } from './components/tgt-heading/tgt-heading.component';
import { TgtPhotoUploaderComponent } from './components/tgt-photo-uploader/tgt-photo-uploader.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TgtModalComponent } from './components/tgt-modal/tgt-modal.component';
import { TgtTextInputComponent } from './components/form-controls/tgt-text-input/tgt-text-input.component';
import { TgtContactNumberComponent } from './components/form-controls/tgt-contact-number/tgt-contact-number.component';
import { TgtDropdownComponent } from './components/form-controls/tgt-dropdown/tgt-dropdown.component';
import { TgtRadioButtonComponent } from './components/form-controls/tgt-radio-button/tgt-radio-button.component';
import { TgtTextareaComponent } from './components/form-controls/tgt-textarea/tgt-textarea.component';
import { TgtDatepickerComponent } from './components/form-controls/tgt-datepicker/tgt-datepicker.component';
import { TgtMultiSelectComponent } from './components/form-controls/tgt-multi-select/tgt-multi-select.component';
import { TgtCheckboxComponent } from './components/form-controls/tgt-checkbox/tgt-checkbox.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TgtFieldWrapperComponent } from './components/form-controls/tgt-field-wrapper/tgt-field-wrapper.component';
import { TgtYearPickerComponent } from './components/form-controls/tgt-year-picker/tgt-year-picker.component';
import { TgtChipComponent } from './components/form-controls/tgt-chip/tgt-chip.component';
import { TgtToggleComponent } from './components/form-controls/tgt-toggle/tgt-toggle.component';
import { TgtCompositeInputComponent } from './components/form-controls/tgt-composite-input/tgt-composite-input.component';
import { TgtFileUploadComponent } from './components/form-controls/tgt-file-upload/tgt-file-upload.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { TgtDrawerComponent } from './components/tgt-drawer/tgt-drawer.component';
import { TgtAutocompleteMultiselectComponent } from './components/form-controls/tgt-autocomplete-multiselect/tgt-autocomplete-multiselect.component';
import { TgtPageLoaderComponent } from './components/tgt-page-loader/tgt-page-loader.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TgtCalendarComponent } from './components/tgt-calendar/tgt-calendar.component';
import { TgtGeneralDropdownComponent } from './components/general-controls/tgt-general-dropdown/tgt-general-dropdown.component';
import { TgtCalendarDayViewComponent } from './components/tgt-calendar-day-view/tgt-calendar-day-view.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TgtAutocompleteComponent } from './components/form-controls/tgt-autocomplete/tgt-autocomplete.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  declarations: [
    TgtCardComponent,
    TgtAvatarComponent,
    TgtWidgetComponent,
    TgtRightNavComponent,
    TgtOffice365IconsComponent,
    TgtEventCalendarComponent,
    TgtFullWidthCardComponent,
    TgtLiLeftContentComponent,
    TgtLiRightContentComponent,
    TgtLiTextContentComponent,
    TgtLiContentWrapperComponent,
    TgtLiComponent,
    TgtHorizontalTimelineComponent,
    TgtLoaderComponent,
    TgtStarRatingComponent,
    TgtVerticalTimelineComponent,
    TgtPerfectScrollComponent,
    TgtHeadingComponent,
    TgtPhotoUploaderComponent,
    TgtModalComponent,
    TgtTextInputComponent,
    TgtContactNumberComponent,
    TgtDropdownComponent,
    TgtRadioButtonComponent,
    TgtTextareaComponent,
    TgtDatepickerComponent,
    TgtMultiSelectComponent,
    TgtCheckboxComponent,
    TgtFieldWrapperComponent,
    TgtYearPickerComponent,
    TgtChipComponent,
    TgtToggleComponent,
    TgtCompositeInputComponent,
    TgtFileUploadComponent,
    TgtDrawerComponent,
    TgtAutocompleteMultiselectComponent,
    TgtPageLoaderComponent,
    TgtCalendarComponent,
    TgtGeneralDropdownComponent,
    TgtCalendarDayViewComponent,
    TgtAutocompleteComponent
  ],
  imports: [
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatDatepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatStepperModule,
    CommonModule,
    NgxSkeletonLoaderModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    NgxStarsModule,
    ImageCropperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot(),
    ScrollingModule,
    NgxDropzoneModule,
    MatMenuModule,
    TooltipModule.forRoot({
      "tooltip-class" : "toolTipClass",
      "hide-delay": 10,
      "autoPlacement": false,
      "placement":"bottom",
      "displayTouchscreen":false
    })
  ],
  exports: [
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    OverlayModule,
    ScrollingModule,
    DragDropModule,

    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    TooltipModule,
    MatTreeModule,
    TgtCardComponent,
    TgtAvatarComponent,
    TgtWidgetComponent,
    TgtOffice365IconsComponent,
    TgtRightNavComponent,
    TgtEventCalendarComponent,
    TgtFullWidthCardComponent,
    TgtLiLeftContentComponent,
    TgtLiRightContentComponent,
    TgtLiTextContentComponent,
    TgtLiContentWrapperComponent,
    TgtLiComponent,
    TgtLoaderComponent,
    TgtPerfectScrollComponent,
    TgtStarRatingComponent,
    TgtVerticalTimelineComponent,
    TgtHorizontalTimelineComponent,
    TgtHeadingComponent,
    TgtPhotoUploaderComponent,
    TgtModalComponent,
    TgtTextInputComponent,
    TgtContactNumberComponent,
    TgtDropdownComponent,
    TgtRadioButtonComponent,
    TgtTextareaComponent,
    TgtDatepickerComponent,
    TgtMultiSelectComponent,
    TgtCheckboxComponent,
    TgtYearPickerComponent,
    TgtChipComponent,
    TgtToggleComponent,
    TgtCompositeInputComponent,
    TgtFileUploadComponent,
    TgtDrawerComponent,
    TgtAutocompleteMultiselectComponent,
    TgtPageLoaderComponent,
    TgtFieldWrapperComponent,
    NgxDropzoneModule,
    TgtCalendarComponent,
    TgtGeneralDropdownComponent,
    TgtCalendarDayViewComponent,
    TgtAutocompleteComponent
],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UiComponentModule { }
