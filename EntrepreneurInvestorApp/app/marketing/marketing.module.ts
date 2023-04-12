import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CoreModule } from '../core/core.module';
import { UiComponentModule } from '../ui-component/ui-component.module';
import { MarketingDetailComponent } from './components/marketing-detail/marketing-detail.component';
import { MarketingHeaderComponent } from './components/marketing-detail/marketing-header/marketing-header.component';
import { AboutComponent } from './components/marketing-detail/about/about.component';
import { BrandsOnboardComponent } from './components/marketing-detail/brands-onboard/brands-onboard.component';
import { HowItWorksComponent } from './components/marketing-detail/how-it-works/how-it-works.component';
import { NurturTvShowComponent } from './components/marketing-detail/nurtur-tv-show/nurtur-tv-show.component';
import { TestimonialComponent } from './components/marketing-detail/testimonial/testimonial.component';
import { WhatWeOfferComponent } from './components/marketing-detail/what-we-offer/what-we-offer.component';
import { WhyUsComponent } from './components/marketing-detail/why-us/why-us.component';
import { MarketingRoutingModule } from './marketing-routing.module';

@NgModule({
  declarations: [
    MarketingDetailComponent,
    MarketingHeaderComponent,
    AboutComponent,
    BrandsOnboardComponent,
    HowItWorksComponent,
    NurturTvShowComponent,
    TestimonialComponent,
    WhatWeOfferComponent,
    WhyUsComponent
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    UiComponentModule,
    CoreModule,
    MatCarouselModule.forRoot()
  ],
})
export class MarketingModule { }
