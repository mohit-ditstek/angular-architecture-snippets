import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingDetailComponent } from './components/marketing-detail/marketing-detail.component';

const routes: Routes = [
  {
    path: 'home',
    component: MarketingDetailComponent
  },
  {
    path: '',
    redirectTo: 'home'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
