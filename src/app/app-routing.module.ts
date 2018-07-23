import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorsComponent }      from './vendors/vendors.component';
import { VendingComponent }   from './vending/vending.component';
import { VendorDetailComponent }  from './vendor-detail/vendor-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/vending', pathMatch: 'full' },
  { path: 'vending', component: VendingComponent },
  { path: 'detail/:id', component: VendorDetailComponent },
  { path: 'vendors', component: VendorsComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class AppRoutingModule {}
