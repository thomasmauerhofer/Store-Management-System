import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {asyncData} from '../../testing/async-observable-helpers';
import {getTestConfig} from '../../testing/test-config';
import {AuthenticationService} from '../../services/authentification.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationServiceSpy: {login: jasmine.Spy };


  beforeEach(async(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['login']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: AuthenticationService, useValue: authenticationServiceSpy }
    ])).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('onSubmit clicked', () => {
    const expectedUser = {username: 'admin', password: 'admin'};
    authenticationServiceSpy.login.and.returnValue(asyncData(expectedUser));
    component.onSubmit();
    expect(authenticationServiceSpy.login.calls.count()).toBe(1);
  });
});
