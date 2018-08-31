import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StoresComponent} from './components/stores/stores.component';
import {StoreDetailComponent} from './components/store-detail/store-detail.component';
import {StoreNewComponent} from './components/store-new/store-new.component';
import {StoreEditComponent} from './components/store-edit/store-edit.component';
import {AggregationComponent} from './components/aggregation/aggregation.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {LoginComponent} from './components/login/login.component';
import {LoggedinGuard} from './utils/multiuser/loggedin-guard';
import {AdminGuard} from './utils/multiuser/admin-guard';

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'stores', component: StoresComponent, canActivate: [LoggedinGuard]},
  {path: 'detail/:id', component: StoreDetailComponent, canActivate: [LoggedinGuard]},
  {path: 'aggregation', component: AggregationComponent, canActivate: [LoggedinGuard]},
  {path: 'new', component: StoreNewComponent, canActivate: [AdminGuard]},
  {path: 'edit/:id', component: StoreEditComponent, canActivate: [AdminGuard]},
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
