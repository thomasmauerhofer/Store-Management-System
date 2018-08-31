import { TestBed, async } from '@angular/core/testing';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import { AppComponent } from './app.component';
import {StoreService} from './services/store.service';
import {asyncData, asyncError} from './testing/async-observable-helpers';
import {AuthenticationService} from './services/authentification.service';
import {Role, User} from './models/user';
import {getTestConfig} from './testing/test-config';
import {calculateAggregationValues, mean, std} from './utils/math';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(getTestConfig([])).compileComponents();
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

describe('StoreService', () => {
  let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, put: jasmine.Spy, delete: jasmine.Spy };
  let storeService: StoreService;
  const expectedStores = [
    {id: 1, name: 'Berlin', countryCode: 'DE', email: 'Berlin@detego.com', mgrFirstName: 'Freddie', mgrLastName: 'Emmot', mgrEmail: 'femmot0@squidoo.com', category: 10 , stockBackstore: 1514 , stockFrontstore: 5865 , stockShoppingWindow: 43 , stockAccuracy: 0.946 , onFloorAvailability: 0.888, stockMeanAge: 13},
    {id: 2, name: 'Hamburg', countryCode: 'DE', email: 'Hamburg@detego.com', mgrFirstName: 'Kearney', mgrLastName: 'Roth', mgrEmail: 'kroth1@geocities.jp', category: 5 , stockBackstore: 863 , stockFrontstore: 2581 , stockShoppingWindow: 18 , stockAccuracy: 0.806 , onFloorAvailability: 0.999 , stockMeanAge: 11},
    {id: 3, name: 'München', countryCode: 'DE', email: 'München@detego.com', mgrFirstName: 'Drusy', mgrLastName: 'Risby', mgrEmail: 'drisby2@wikimedia.org', category: 6 , stockBackstore: 1195 , stockFrontstore: 4309 , stockShoppingWindow: 9 , stockAccuracy: 0.987 , onFloorAvailability: 0.945 , stockMeanAge: 7}
  ];


  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    storeService = new StoreService(<any> httpClientSpy);
  });


  it('Method: getStores() (Http GET called once)', () => {
    httpClientSpy.get.and.returnValue(asyncData(expectedStores));

    storeService.getStores().subscribe(
      stores => expect(stores).toEqual(expectedStores), fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });


  it('Method: getStore() (Http GET called once)', () => {
    httpClientSpy.get.and.returnValue(asyncData(expectedStores[0]));

    storeService.getStore(expectedStores[0].id).subscribe(
      store => expect(store).toEqual(expectedStores[0]), fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1);
  });


  it('Method: addStore() (Http POST called once)', () => {
    httpClientSpy.post.and.returnValue(asyncData(expectedStores[0]));
    // httpClientSpy.put.and.returnValue(asyncData(expectedStores));

    storeService.addStore(expectedStores[0]).subscribe(
      store => expect(store).toEqual(expectedStores[0]), fail
    );
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });


  it('Method: updateStore() (Http PUT called once)', () => {
    httpClientSpy.put.and.returnValue(asyncData(expectedStores[0]));

    storeService.updateStore(expectedStores[0]).subscribe(
      store => expect(store).toEqual(expectedStores[0]), fail
    );
    expect(httpClientSpy.put.calls.count()).toBe(1, );
  });


  it('Method: deleteStore() (Http DELETE called once)', () => {
    httpClientSpy.delete.and.returnValue(asyncData(expectedStores[0]));

    storeService.deleteStore(expectedStores[0].id).subscribe(
      store => expect(store).toEqual(expectedStores[0]), fail
    );
    expect(httpClientSpy.delete.calls.count()).toBe(1);
  });


  it('error responses in all methods', () => {
    const errorResponse = new HttpErrorResponse({
      error: '404 Not Found',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    httpClientSpy.post.and.returnValue(asyncError(errorResponse));
    httpClientSpy.put.and.returnValue(asyncError(errorResponse));
    httpClientSpy.delete.and.returnValue(asyncError(errorResponse));

    storeService.getStores().subscribe(
      stores => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );

    storeService.getStore(expectedStores[0].id).subscribe(
      store => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );

    storeService.updateStore(expectedStores[0]).subscribe(
      store => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );

    storeService.addStore(expectedStores[0]).subscribe(
      store => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );

    storeService.deleteStore(expectedStores[0].id).subscribe(
      store => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );
  });
});


describe('AuthentificationService', () => {
  let httpClientSpy: { post: jasmine.Spy };
  let authenticationService: AuthenticationService;
  const expectedUser = {id: 1, username: 'admin', password: 'admin', role: Role.Admin};

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    authenticationService = new AuthenticationService(<any> httpClientSpy);
  });


  it('Method: login() (Http POST called once)', () => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    authenticationService.login(expectedUser).subscribe(
      user => expect(user).toEqual(expectedUser), fail
    );
    expect(httpClientSpy.post.calls.count()).toBe(1, );
  });

  it('Method: logout() (Http POST called once)', () => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    authenticationService.logout(expectedUser).subscribe(
      user => expect(user), fail
    );
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });


  it('error responses in all methods', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'testing 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    authenticationService.login(expectedUser).subscribe(
      user => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );

    authenticationService.logout(expectedUser).subscribe(
      user => fail('expected an error, not stores'),
      error  => expect(error.message).toContain('404 Not Found')
    );
  });

  describe('Utils Tests', () => {
    it('Math mean', () => {
      expect(mean([1, 2, 3, 4, 5, 6, 7])).toBe(4);
    });

    it('Math mean', () => {
      expect(std([1, 2, 3, 4, 5, 6, 7])).toBe(2);
    });

    it('Math mean', () => {
      expect(calculateAggregationValues([1, 2, 3, 4, 5, 6, 7], 2))
        .toEqual({hist: {data: [ 4, 3 ], labels: ['1-4', '4-7']}, min: 1, max: 7, mean: 4, std: 2});
    });
  });
});
