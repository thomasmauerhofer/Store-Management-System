import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {StoreDetailComponent} from './store-detail.component';
import {Role} from '../../models/user';
import {getTestConfig} from '../../testing/test-config';
import {StoreService} from '../../services/store.service';
import {asyncData} from '../../testing/async-observable-helpers';
import {HttpErrorResponse} from '@angular/common/http';


const expectedStores = [
  {id: 1, name: 'Berlin', countryCode: 'DE', email: 'Berlin@detego.com', mgrFirstName: 'Freddie', mgrLastName: 'Emmot', mgrEmail: 'femmot0@squidoo.com', category: 10 , stockBackstore: 1514 , stockFrontstore: 5865 , stockShoppingWindow: 43 , stockAccuracy: 0.946 , onFloorAvailability: 0.888, stockMeanAge: 13},
  {id: 2, name: 'Hamburg', countryCode: 'DE', email: 'Hamburg@detego.com', mgrFirstName: 'Kearney', mgrLastName: 'Roth', mgrEmail: 'kroth1@geocities.jp', category: 5 , stockBackstore: 863 , stockFrontstore: 2581 , stockShoppingWindow: 18 , stockAccuracy: 0.806 , onFloorAvailability: 0.999 , stockMeanAge: 11},
  {id: 3, name: 'München', countryCode: 'DE', email: 'München@detego.com', mgrFirstName: 'Drusy', mgrLastName: 'Risby', mgrEmail: 'drisby2@wikimedia.org', category: 6 , stockBackstore: 1195 , stockFrontstore: 4309 , stockShoppingWindow: 9 , stockAccuracy: 0.987 , onFloorAvailability: 0.945 , stockMeanAge: 7}
];
const errorResponse = new HttpErrorResponse({
  error: '404 Not Found',
  status: 404, statusText: 'Not Found'
});

let component: StoreDetailComponent;
let fixture: ComponentFixture<StoreDetailComponent>;
let storeServiceSpy: {getStore: jasmine.Spy, getStores: jasmine.Spy};


describe('StoreDetailComponent', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStore', 'getStores']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStore.and.returnValue(asyncData(expectedStores[0]));
    storeServiceSpy.getStores.and.returnValue(asyncData(expectedStores));
    fixture = TestBed.createComponent(StoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStore.calls.count()).toBe(1);
    expect(storeServiceSpy.getStores.calls.count()).toBe(1);
  });


  it('content set', fakeAsync(() => {
    fixture.whenStable().then(() => { // wait for async getQuote
      expect(component.store).toBe(expectedStores[0]);
      expect(component.meanAgeData[0].data.length).toBeGreaterThan(0);
      expect(component.stockData[0].data.length).toBeGreaterThan(0);
      expect(component.stockAccData[0].data.length).toBeGreaterThan(0);
      expect(component.onFloorData[0].data.length).toBeGreaterThan(0);

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain(expectedStores[0].name);

      const data = compiled.querySelector('dd').textContent;
      expect(data).toContain(expectedStores[0].category);
      expect(data).toContain(expectedStores[0].countryCode);
      expect(data).toContain(expectedStores[0].email);
      expect(data).toContain(expectedStores[0].mgrFirstName);
      expect(data).toContain(expectedStores[0].mgrLastName);
      expect(data).toContain(expectedStores[0].mgrEmail);
    });
  }));
});


describe('StoreDetailComponent - error api call', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStore', 'getStores']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStore.and.returnValue(asyncData(errorResponse));
    storeServiceSpy.getStores.and.returnValue(asyncData(errorResponse));
    fixture = TestBed.createComponent(StoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStore.calls.count()).toBe(1);
    expect(storeServiceSpy.getStores.calls.count()).toBe(1);
  });


  it('error message set', fakeAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.loadingStoreError).toBeTruthy();
      expect(component.loadingValuesError).toBeTruthy();

      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const errors = compiled.querySelector('.error').textContent;
      expect(errors).toContain('Sorry, the store you want to view is not available');
      expect(errors).toContain('Sorry, the store characteristics are not available');
    });
  }));
});
