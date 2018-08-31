import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthenticationService} from '../../services/authentification.service';
import {HeaderLoggedinComponent} from './header-loggedin.component';
import {Role} from '../../models/user';
import {asyncData} from '../../testing/async-observable-helpers';
import {getTestConfig} from '../../testing/test-config';


describe('HeaderLoggedinComponent', () => {
  let component: HeaderLoggedinComponent;
  let fixture: ComponentFixture<HeaderLoggedinComponent>;
  let authenticationServiceSpy: {logout: jasmine.Spy };


  beforeEach(() => {
    const storage = {'user': JSON.stringify({role: Role.Admin})};

    spyOn(localStorage, 'getItem').and.callFake( (key: string): String => {
      return storage[key] || null;
    });
  });


  beforeEach(async(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);

    TestBed.configureTestingModule(getTestConfig([
      { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ])).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderLoggedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('logout clicked', () => {
    const expectedUser = {id: 1, username: 'admin', password: 'admin', role: Role.Admin};
    authenticationServiceSpy.logout.and.returnValue(asyncData(expectedUser));
    component.logout();
    expect(authenticationServiceSpy.logout.calls.count()).toBe(1, );
  });


  it('dropdown - admin', () => {
    const compiled = fixture.debugElement.nativeElement;
    const ul = compiled.querySelector('ul').textContent;
    expect(ul).toContain('Home');
    expect(ul).toContain('New Store');
    expect(ul).toContain('Display Aggregation');
    expect(ul).toContain('Logout');
  });


  it('dropdown - user', () => {
    component.user.role = Role.User;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ul').textContent).toContain('Home');
    expect(compiled.querySelector('ul').textContent).not.toContain('New Store');
    expect(compiled.querySelector('ul').textContent).toContain('Display Aggregation');
    expect(compiled.querySelector('ul').textContent).toContain('Logout');
  });
});
