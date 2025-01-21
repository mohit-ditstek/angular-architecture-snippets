import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { UnSubscriptionComponent } from './components/un-subscription/un-subscription.component';

@NgModule({
  declarations: [UnSubscriptionComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule
  ]
})

export class SharedModule { }
