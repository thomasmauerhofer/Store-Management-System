import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './services/in-memory-data.service';
import {ChartsModule} from 'ng2-charts';
import {NotifierModule} from 'angular-notifier';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StoresComponent} from './components/stores/stores.component';
import {StoreDetailComponent} from './components/store-detail/store-detail.component';
import {HeaderLoggedinComponent} from './components/header-loggedin/header-loggedin.component';
import {StoreNewComponent} from './components/store-new/store-new.component';
import {StoreEditComponent} from './components/store-edit/store-edit.component';
import {AggregationComponent} from './components/aggregation/aggregation.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {LoginComponent} from './components/login/login.component';
import {JwtInterceptor} from './utils/multiuser/jwt-interceptor';
import {FakeBackendLoginInterceptor} from './services/fakebackendlogin.interceptor';
import {LoggedinGuard} from './utils/multiuser/loggedin-guard';
import {AdminGuard} from './utils/multiuser/admin-guard';
import {HeaderLoggedoutComponent} from './components/header-loggedout/header-loggedout.component';


@NgModule({
  declarations: [
    AppComponent,
    StoresComponent,
    StoreDetailComponent,
    HeaderLoggedinComponent,
    StoreNewComponent,
    StoreEditComponent,
    AggregationComponent,
    PageNotFoundComponent,
    LoginComponent,
    HeaderLoggedoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatListModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    NotifierModule.withConfig( {
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 70,
        }
      },
      behaviour: {
        autoHide: 3000,
      }
    }),

    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [
    LoggedinGuard,
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendLoginInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
