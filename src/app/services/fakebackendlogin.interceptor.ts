import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import {Role, User} from '../models/user';

@Injectable()
export class FakeBackendLoginInterceptor implements HttpInterceptor {
  public users: User[] = [
    {id: 1, username: 'admin', password: '123456', role: Role.Admin},
    {id: 2, username: 'user', password: '123456', role: Role.User}
  ];

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // simulate delayed server api call
    return of(null).pipe(mergeMap(() => {

      if (request.url === 'api/store/login' && request.method === 'POST') {
        const filteredUsers = this.users.filter(user => {
          return user.username === request.body.username && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          const user = filteredUsers[0];
          const body = {
            id: user.id,
            username: user.username,
            role: user.role,
            token: 'fake-jwt-token'
          };

          return of(new HttpResponse({ status: 200, body: body }));
        } else {
          return throwError({ error: { message: 'Username or password is incorrect'}});
        }
      } else if (request.url === 'api/store/logout' && request.method === 'POST') {
        console.log('Simulated logout for user: ' + request.body.username);
        return of(new HttpResponse({ status: 200, body: {} }));
      }
      return next.handle(request);
    })).pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}
