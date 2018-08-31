import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {StoreNewComponent} from './store-new.component';
import {Role} from '../../models/user';
import {getTestConfig} from '../../testing/test-config';
import {StoreService} from '../../services/store.service';
import {asyncData} from '../../testing/async-observable-helpers';


describe('StoreNewComponent', () => {
  let component: StoreNewComponent;
  let fixture: ComponentFixture<StoreNewComponent>;
  let storeServiceSpy: {addStore: jasmine.Spy};

  const expectedStore = {id: 1, name: 'Berlin', countryCode: 'DE', email: 'Berlin@detego.com', mgrFirstName: 'Freddie', mgrLastName: 'Emmot', mgrEmail: 'femmot0@squidoo.com', category: 10 , stockBackstore: 1514 , stockFrontstore: 5865 , stockShoppingWindow: 43 , stockAccuracy: 0.946 , onFloorAvailability: 0.888, stockMeanAge: 13};


  beforeEach(() => {
    const store = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return store[key] || null;
    });
  });


  beforeEach(async(() => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['addStore']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: StoreService, useValue: storeServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(StoreNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('submit clicked', () => {
    storeServiceSpy.addStore.and.returnValue(asyncData(expectedStore));
    component.model = expectedStore;
    component.onSubmit({submitted: true, form: {reset: function () {}}});
    expect(storeServiceSpy.addStore.calls.count()).toBe(1);
  });
});
