import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models/user';
import {logError} from '../utils/dummy-logger';
import {Observable, throwError} from 'rxjs';
import {Store} from '../models/store';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userUrl = 'api/store';

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post<any>(this.userUrl + '/login', user).pipe(
      catchError(this.handleError<Store>('login')
      ), map(userdata => {
        if (userdata && userdata.token) {
          localStorage.setItem('user', JSON.stringify(userdata));
        }
        return userdata;
      }));
  }

  logout(user: User) {
    return this.http.post<any>(this.userUrl + '/logout', user).pipe(
      catchError(this.handleError<Store>('logout')
      ), map(() => {
        localStorage.removeItem('user');
      }));
  }

  private handleError<T> (operation) {
    return (error: Observable<T>): Observable<T> => {
      logError('AuthenticationService.' + operation, error);
      return throwError(error);
    };
  }
}
