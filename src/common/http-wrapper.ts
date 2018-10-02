import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs, RequestMethod, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/throw'

import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class HttpWrapper<T> {
    isInRequest: boolean = false
    constructor(
        private http: HttpClient, 
        private router: Router
    ) { }
    get(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Get, url, null, options);
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Post, url, body, options);
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Put, url, body, options);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Delete, url, null, options);
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Patch, url, body, options);
    }

    head(url: string, options?: RequestOptionsArgs): Observable<T> {
        return this.request(RequestMethod.Head, url, null, options);
    }

    private request(method: RequestMethod, url: string, body?: any, options?: RequestOptionsArgs): Observable<T> {
        const requestOptions = new HttpRequest<any>(
            RequestMethod[method.toString()],
            url,
            body
        )
        return Observable.create((observer) => {
            this.http.request(requestOptions)
                .subscribe((response: any | HttpResponse<any>) => {
                    if (response.type) {
                        this.isInRequest = false
                        observer.next(response.body);
                        observer.complete();
                    }
                    if (response.error) {
                        this.isInRequest = false
                        observer.error(response)
                        if (response.status === 401) {
                            this.router.navigateByUrl('/login')
                        }
                    }
                }, (error) => {
                    observer.error(error)
                })
        })
    }
}