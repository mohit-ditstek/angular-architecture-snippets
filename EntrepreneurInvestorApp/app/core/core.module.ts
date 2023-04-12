import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './pipes/filter.pipe';
import { MinuteSecondsPipe } from './pipes/minute-seconds.pipe';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CurrencyTransformPipe } from './pipes/currency-transform.pipe';
import { ListingLabelByValuePipe } from './pipes/listing-label-by-value.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
@NgModule({
  declarations: [
    FilterPipe,
    MinuteSecondsPipe,
    CurrencyTransformPipe,
    ListingLabelByValuePipe,
    SanitizeHtmlPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: environment.toasterTimeOut,
      positionClass: environment.toasterPosition,
      preventDuplicates: true,
    })
  ],
  exports: [
    FilterPipe,
    MinuteSecondsPipe,
    CurrencyTransformPipe,
    ListingLabelByValuePipe,
    SanitizeHtmlPipe
  ]
})
export class CoreModule { }
