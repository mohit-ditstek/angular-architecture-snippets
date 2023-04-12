import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService as RoleGuard } from './core/guards/role-guard.service';
import { ForwardGuardService as ForwardGuard } from './core/guards/forward-guard.service'
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule),
        canActivate: [ForwardGuard]
    },
    {
        path: '',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
        canActivate: [ForwardGuard]
    },
    {
        path: 'entrepreneur',
        loadChildren: () => import('./entrepreneur/entrepreneur.module').then( m=> m.EntrepreneurModule),
        canActivate: [RoleGuard],
        data: { 
          expectedRole: 'ROLE_ENTREPRENEUR'
        } 
    },
    {
        path: 'investor',
        loadChildren: () => import('./investor/investor.module').then( m=> m.InvestorModule),
        canActivate: [RoleGuard],
        data: { 
          expectedRole: 'ROLE_INVESTOR'
        } 
    },
    {
        path: 'service-provider',
        loadChildren: () => import('./service-provider/service-provider.module').then( m=> m.ServiceProviderModule),
        canActivate: [RoleGuard],
        data: { 
          expectedRole: 'ROLE_SERVICE_PROVIDER'
        } 
    },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '404' }

    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
