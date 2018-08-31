import {FormsModule} from '@angular/forms';
import {HeaderLoggedoutComponent} from '../components/header-loggedout/header-loggedout.component';
import {StoreDetailComponent} from '../components/store-detail/store-detail.component';
import {StoreEditComponent} from '../components/store-edit/store-edit.component';
import {LoginComponent} from '../components/login/login.component';
import {ChartsModule} from 'ng2-charts';
import {StoresComponent} from '../components/stores/stores.component';
import {HeaderLoggedinComponent} from '../components/header-loggedin/header-loggedin.component';
import {RouterTestingModule} from '@angular/router/testing';
import {routes} from '../app-routing.module';
import {NotifierModule} from 'angular-notifier';
import {AggregationComponent} from '../components/aggregation/aggregation.component';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';
import {StoreNewComponent} from '../components/store-new/store-new.component';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from '../app.component';

export function getTestConfig(providers: any[]) {
  return {
    declarations: [
      AppComponent,
      HeaderLoggedinComponent,
      HeaderLoggedoutComponent,
      StoresComponent,
      AggregationComponent,
      StoreDetailComponent,
      StoreEditComponent,
      PageNotFoundComponent,
      LoginComponent,
      StoreNewComponent
    ], imports: [
    HttpClientModule,
    RouterTestingModule.withRoutes(routes),
    NotifierModule,
    FormsModule,
    ChartsModule
  ], providers: providers
  };
}
