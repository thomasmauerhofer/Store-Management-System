import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Store} from '../models/store';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {logError} from '../utils/dummy-logger';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private storesUrl = 'api/stores';

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.storesUrl).pipe(
      catchError(this.handleError<Store[]>('getStores')
      ), map(stores => {
        stores.sort(function(a: Store, b: Store) {
          return a.name.localeCompare(b.name);
        });
        return stores;
      }));
  }

  getStore(id: number): Observable<Store> {
    const url = `${this.storesUrl}/${id}`;
    return this.http.get<Store>(url).pipe(
      catchError(this.handleError<Store>(`getStore id=${id}`))
    );
  }

  updateStore (store: Store): Observable<any> {
    return this.http.put(this.storesUrl, store, httpOptions).pipe(
      catchError(this.handleError<any>('updateStore'))
    );
  }

  addStore (store: Store): Observable<Store> {
    return this.http.post<Store>(this.storesUrl, store, httpOptions).pipe(
      catchError(this.handleError<Store>('addHero'))
    );
  }

  deleteStore (id: number): Observable<Store> {
    const url = `${this.storesUrl}/${id}`;
    return this.http.delete<Store>(url, httpOptions).pipe(
      catchError(this.handleError<Store>('deleteHero'))
    );
  }

  private handleError<T> (operation) {
    return (error: Observable<T>): Observable<T> => {
      logError('StoreService.' + operation, error);
      return throwError(error);
    };
  }
}
