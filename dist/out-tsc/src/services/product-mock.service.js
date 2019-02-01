var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { startWith, delay, map } from "rxjs/operators";
export var ProductMockService = (function () {
    function ProductMockService() {
    }
    ProductMockService.prototype.getList = function () {
        var productList = [
            {
                id: 1,
                barcode: '000000111',
                name: 'Polycom DeskPhone 700',
                createdDate: new Date(),
                totalItems: 500,
                avgPrice: 70,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 70,
                maxPrice: 110,
                minPrice: 60
            },
            {
                id: 2,
                barcode: '000000112',
                name: 'Polycom DeskPhone 800',
                createdDate: new Date(),
                totalItems: 250,
                avgPrice: 50,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 50,
                maxPrice: 60,
                minPrice: 50
            },
            {
                id: 3,
                barcode: '000000113',
                name: 'Polycom DeskPhone 900',
                createdDate: new Date(),
                totalItems: 125,
                avgPrice: 40,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 40,
                maxPrice: 75,
                minPrice: 40
            }
        ];
        return Observable.of()
            .pipe(startWith(null), delay(1000), map(function () {
            return productList;
        }));
    };
    ProductMockService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], ProductMockService);
    return ProductMockService;
}());
//# sourceMappingURL=product-mock.service.js.map