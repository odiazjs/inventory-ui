var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
export var HttpWrapper = (function () {
    function HttpWrapper(http, router) {
        this.http = http;
        this.router = router;
        this.isInRequest = false;
    }
    HttpWrapper.prototype.get = function (url, options) {
        return this.request(RequestMethod.Get, url, null, options);
    };
    HttpWrapper.prototype.post = function (url, body, options) {
        return this.request(RequestMethod.Post, url, body, options);
    };
    HttpWrapper.prototype.put = function (url, body, options) {
        return this.request(RequestMethod.Put, url, body, options);
    };
    HttpWrapper.prototype.delete = function (url, options) {
        return this.request(RequestMethod.Delete, url, null, options);
    };
    HttpWrapper.prototype.patch = function (url, body, options) {
        return this.request(RequestMethod.Patch, url, body, options);
    };
    HttpWrapper.prototype.head = function (url, options) {
        return this.request(RequestMethod.Head, url, null, options);
    };
    HttpWrapper.prototype.request = function (method, url, body, options) {
        var _this = this;
        var requestOptions = new HttpRequest(RequestMethod[method.toString()], url, body);
        this.isInRequest = true;
        return Observable.create(function (observer) {
            _this.http.request(requestOptions)
                .subscribe(function (response) {
                if (response.type) {
                    _this.isInRequest = false;
                    observer.next(response.body);
                    observer.complete();
                }
                if (response.error) {
                    _this.isInRequest = false;
                    observer.error(response);
                    if (response.status === 401) {
                        _this.router.navigateByUrl('/login');
                    }
                }
            }, function (error) {
                observer.error(error);
            });
        });
    };
    HttpWrapper = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpClient, Router])
    ], HttpWrapper);
    return HttpWrapper;
}());
//# sourceMappingURL=http-wrapper.js.map