import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {StoreEditComponent} from './store-edit.component';
import {Role} from '../../models/user';
import {getTestConfig} from '../../testing/test-config';
import {StoreService} from '../../services/store.service';
import {HttpErrorResponse} from '@angular/common/http';
import {asyncData} from '../../testing/async-observable-helpers';


const expectedStore = {id: 1, name: 'Berlin', countryCode: 'DE', email: 'Berlin@detego.com', mgrFirstName: 'Freddie', mgrLastName: 'Emmot', mgrEmail: 'femmot0@squidoo.com', category: 10 , stockBackstore: 1514 , stockFrontstore: 5865 , stockShoppingWindow: 43 , stockAccuracy: 0.946 , onFloorAvailability: 0.888, stockMeanAge: 13};
const errorResponse = new HttpErrorResponse({
  error: '404 Not Found',
  status: 404, statusText: 'Not Found'
});

let component: StoreEditComponent;
let fixture: ComponentFixture<StoreEditComponent>;
let storeServiceSpy: {getStore: jasmine.Spy, updateStore: jasmine.Spy};


describe('StoreEditComponent', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStore', 'updateStore']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStore.and.returnValue(asyncData(expectedStore));
    storeServiceSpy.updateStore.and.returnValue(asyncData(expectedStore));

    fixture = TestBed.createComponent(StoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStore.calls.count()).toBe(1);
  });


  it('content set', fakeAsync(() => {
    fixture.whenStable().then(() => { // wait for async getQuote
      expect(component.store).toBe(expectedStore);

      const compiled = fixture.debugElement.nativeElement;
      const data = compiled.querySelector('input').textContent;
      expect(data).toContain(expectedStore.name);
      expect(data).toContain(expectedStore.category);
      expect(data).toContain(expectedStore.countryCode);
      expect(data).toContain(expectedStore.email);
      expect(data).toContain(expectedStore.mgrFirstName);
      expect(data).toContain(expectedStore.mgrLastName);
      expect(data).toContain(expectedStore.mgrEmail);
      expect(data).toContain(expectedStore.stockAccuracy);
      expect(data).toContain(expectedStore.stockBackstore);
      expect(data).toContain(expectedStore.stockFrontstore);
      expect(data).toContain(expectedStore.stockShoppingWindow);
      expect(data).toContain(expectedStore.stockMeanAge);
      expect(data).toContain(expectedStore.onFloorAvailability);
    });
  }));


  it('submit clicked', () => {
    component.onSubmit();
    expect(storeServiceSpy.updateStore.calls.count()).toBe(1);
  });
});


describe('StoreEditComponent - error api call', () => {
  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['getStore', 'updateStore']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    storeServiceSpy.getStore.and.returnValue(asyncData(errorResponse));

    fixture = TestBed.createComponent(StoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
    expect(storeServiceSpy.getStore.calls.count()).toBe(1);
  });


  it('error message set', fakeAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const errors = compiled.querySelector('.error').textContent;
      expect(errors).toContain('Sorry, the store you want to edit is not available');
    });
  }));
});
