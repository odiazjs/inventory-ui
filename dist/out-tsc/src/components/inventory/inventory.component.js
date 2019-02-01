var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
export var InventoryComponent = (function () {
    function InventoryComponent(productService) {
        this.productService = productService;
        this.modalShown = false;
        this.productsList = [];
    }
    InventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        Observable.of().pipe(startWith(null), delay(0)).subscribe(function () {
            _this.productService.getList()
                .subscribe(function (result) {
                _this.productsList = result.slice();
            });
        });
    };
    InventoryComponent.prototype.showModal = function () {
        return this.modalShown = !this.modalShown;
    };
    InventoryComponent = __decorate([
        Component({
            selector: 'app-inventory',
            templateUrl: './inventory.template.html',
            styleUrls: ['./inventory.component.scss']
        }), 
        __metadata('design:paramtypes', [ProductService])
    ], InventoryComponent);
    return InventoryComponent;
}());
//# sourceMappingURL=inventory.component.js.map