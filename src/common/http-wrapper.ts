import { Injectable } from '@angular/core';
import { RequestOptionsArgs, RequestMethod } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/throw'

import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Logout } from 'src/ngxs/models/authState.model';
import { Store } from '@ngxs/store';

import { sharedService } from './sharedService';

@Injectable()
export class HttpWrapper<T> {
    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store
    ) { }
    get(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Get, url, null, options);
    }

    post<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Post, url, body, options);
    }

    put<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Put, url, body, options);
    }

    delete<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Delete, url, null, options);
    }

    patch<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Patch, url, body, options);
    }

    head<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Head, url, null, options);
    }

    private request<T>(method: RequestMethod, url: string, body?: any, options?: RequestOptionsArgs): Observable<T> {
        const disableRequest = () => {
            sharedService.stopRequest()
        }
        const checkUnauthorized = (response) => {
            if (response.status === 401) {
                this.store.dispatch(new Logout())
                    .subscribe((result) => {
                        this.router.navigate(['/login']);
                    })

            }
        }
        const requestOptions = new HttpRequest<any>(
            RequestMethod[method.toString()],
            url,
            body
        )
        sharedService.makeRequest();
        return Observable.create((observer) => {
            this.http.request(requestOptions)
                .subscribe((response: any | HttpResponse<any>) => {
                    if (response.type) {
                        disableRequest();
                        observer.next(response.body);
                        observer.complete();
                    }
                    if (response.error) {
                        disableRequest();
                        checkUnauthorized(response);
                        observer.error(response);
                    }
                }, (error) => {
                    disableRequest();
                    checkUnauthorized(error);
                    observer.error(error);
                })
        })
    }
}