import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {StoresComponent} from './stores.component';
import {Role} from '../../models/user';
import {getTestConfig} from '../../testing/test-config';
import {StoreService} from '../../services/store.service';
import {HttpErrorResponse} from '@angular/common/http';
import {asyncData} from '../../testing/async-observable-helpers';

const expectedStores = [
  {id: 1, name: 'Berlin', countryCode: 'DE', email: 'Berlin@detego.com', mgrFirstName: 'Freddie', mgrLastName: 'Emmot', mgrEmail: 'femmot0@squidoo.com', category: 10 , stockBackstore: 1514 , stockFrontstore: 5865 , stockShoppingWindow: 43 , stockAccuracy: 0.946 , onFloorAvailability: 0.888, stockMeanAge: 13},
  {id: 2, name: 'Hamburg', countryCode: 'DE', email: 'Hamburg@detego.com', mgrFirstName: 'Kearney', mgrLastName: 'Roth', mgrEmail: 'kroth1@geocities.jp', category: 6 , stockBackstore: 863 , stockFrontstore: 2581 , stockShoppingWindow: 18 , stockAccuracy: 0.806 , onFloorAvailability: 0.999 , stockMeanAge: 11},
  {id: 3, name: 'München', countryCode: 'DE', email: 'München@detego.com', mgrFirstName: 'Drusy', mgrLastName: 'Risby', mgrEmail: 'drisby2@wikimedia.org', category: 6 , stockBackstore: 1195 , stockFrontstore: 4309 , stockShoppingWindow: 9 , stockAccuracy: 0.987 , onFloorAvailability: 0.945 , stockMeanAge: 7}
];
const errorResponse = new HttpErrorResponse({
  error: '404 Not Found',
  status: 404, statusText: 'Not Found'
});

let component: StoresComponent;
let fixture: ComponentFixture<StoresComponent>;
let storeServiceSpy: {getStores: jasmine.Spy, deleteStore: jasmine.Spy};

describe('StoresComponent', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStores', 'deleteStore']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStores.and.returnValue(asyncData(expectedStores));

    fixture = TestBed.createComponent(StoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStores.calls.count()).toBe(1);
  });


  it('content set', fakeAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.stores).toBe(expectedStores);
      expect(component.loadingError).toBeFalsy();

      const compiled = fixture.debugElement.nativeElement;
      const data = compiled.querySelector('td').textContent;
      expect(data).toContain(expectedStores[0].name);
      expect(data).toContain(expectedStores[1].name);
      expect(data).toContain(expectedStores[2].name);
    });
  }));


  it('deleteStore clicked', fakeAsync(() => {
    storeServiceSpy.deleteStore.and.returnValue(asyncData(expectedStores[0]));

    fixture.whenStable().then(() => {
      expect(component.stores.length).toBe(expectedStores.length);
      component.deleteStore(expectedStores[0]);

      this.whenStable().then(() => {
        expect(component.stores.length).toBe(expectedStores.length - 1);
        expect(storeServiceSpy.deleteStore.calls.count()).toBe(1);
      });
    });
  }));


  it('check filter', fakeAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.filteredStores.length).toBe(expectedStores.length);
      component.catInput = '6';
      this.whenStable().then(() => {
        expect(component.filteredStores.length).toBe(2);
        component.nameInput = 'ham';
        this.whenStable().then(() => {
          expect(component.filteredStores.length).toBe(1);
        });
      });
    });
  }));
});


describe('StoresComponent - error content', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStores']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStores.and.returnValue(asyncData(errorResponse));

    fixture = TestBed.createComponent(StoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStores.calls.count()).toBe(1);
  });


  it('error message set', fakeAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.loadingError).toBeTruthy();

      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const errors = compiled.querySelector('.error').textContent;
      expect(errors).toContain('Sorry, the store list is currently not available');
    });
  }));
});
