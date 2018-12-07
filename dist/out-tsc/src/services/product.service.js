var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
import { ResourceService } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { urlConfig } from '../environments/config';
import { ProductModel } from '../models/product.model';
export var ProductService = (function (_super) {
    __extends(ProductService, _super);
    function ProductService(httpWrapper) {
        _super.call(this, httpWrapper, urlConfig.getProductsUrl, productServiceFactory);
    }
    ProductService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpWrapper])
    ], ProductService);
    return ProductService;
}(ResourceService));
var productServiceFactory = function (value) {
    console.log('serializer', value);
    return value.map(function (item) { return new ProductModel(item); });
};
//# sourceMappingURL=product.service.js.map