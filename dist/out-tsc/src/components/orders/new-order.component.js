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
import { Subject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { ProductMockService } from '../../services/product-mock.service';
export var NewOrderComponent = (function () {
    function NewOrderComponent(productService) {
        this.productService = productService;
        this.orderTypes = [
            { id: 1, name: 'IN', icon: 'input' },
            { id: 2, name: 'OUT', icon: 'input' }
        ];
        this.orderStates = [
            'Buy',
            'On-Hand',
            'Sold Out To'
        ];
        this.warehouses = [
            { id: 1, name: 'Warehouse A' },
            { id: 2, name: 'Warehouse B' },
            { id: 3, name: 'Warehouse C' }
        ];
        this.inventories = [
            { id: 1, name: 'Jive New' },
            { id: 2, name: 'Bi-Stock' },
            { id: 3, name: 'Z David Bowley' },
            { id: 4, name: 'Demos' }
        ];
        this.inventoryStatuses = [
            { id: 1, name: 'Buy' },
            { id: 2, name: 'On-Hand' },
            { id: 3, name: 'Sold Out To' }
        ];
        this.itemStatuses = [
            { id: 1, name: 'New' },
            { id: 2, name: 'Used' },
            { id: 3, name: 'Defective' }
        ];
        this.orderProducts = {
            order: {
                orderNumber: null,
                orderType: this.orderTypes[0],
                orderState: this.orderStates[0],
                orderDate: new Date().toLocaleDateString('en-US'),
                ticketNumber: null
            },
            orderDetail: {
                warehouseCat: this.warehouses[0],
                inventoryCat: this.inventories[0],
                onInventoryStatusCat: this.inventoryStatuses[0],
                itemStatusCat: this.itemStatuses[0]
            }
        };
        this.productOrderDetailModelList = [];
        this.keyUp = new Subject();
    }
    NewOrderComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscription = this.keyUp.pipe(map(function (ev) { return ev.target.value; }), debounceTime(300), distinctUntilChanged(), flatMap(function (search) { return Observable.of(search); })).subscribe(function (query) {
            var qtyCounter = 0;
            _this.productService.getList()
                .subscribe(function (products) {
                var product;
                var matches = products.filter(function (x) { return x.barcode == query; });
                console.log(matches);
                if (matches.length) {
                    product = matches[0];
                    var foundIndex_1 = 0;
                    var existingRows = _this.productOrderDetailModelList
                        .filter(function (item, index) {
                        if (item.barcode == query) {
                            foundIndex_1 = index;
                        }
                        return item.barcode == query;
                    });
                    if (existingRows.length) {
                        console.log('exists!');
                        _this.productOrderDetailModelList[foundIndex_1].quantity =
                            _this.productOrderDetailModelList[foundIndex_1].quantity + 1;
                    }
                    else {
                        _this.productOrderDetailModelList.push({
                            barcode: product.barcode,
                            productId: product.id,
                            quantity: qtyCounter + 1,
                            price: product.avgPrice,
                            warehouseCat: _this.orderProducts.orderDetail.warehouseCat,
                            inventoryCat: _this.orderProducts.orderDetail.inventoryCat,
                            onInventoryStatusCat: _this.orderProducts.orderDetail.onInventoryStatusCat,
                            itemStatusCat: _this.orderProducts.orderDetail.itemStatusCat
                        });
                    }
                }
            });
        });
    };
    NewOrderComponent.prototype.switchRadioBtns = function (event, newValue) {
        console.log('radio event...', event);
        this.orderProducts.order.orderType = newValue;
        console.log('new value...', this.orderProducts.order.orderType);
    };
    NewOrderComponent.prototype.change = function () {
        console.log('model...', this.orderProducts);
    };
    NewOrderComponent.prototype.save = function () {
        console.log('saving...');
    };
    NewOrderComponent = __decorate([
        Component({
            selector: 'app-new-order',
            templateUrl: './new-order.template.html',
            styleUrls: ['./new-order.component.scss']
        }), 
        __metadata('design:paramtypes', [ProductMockService])
    ], NewOrderComponent);
    return NewOrderComponent;
}());
//# sourceMappingURL=new-order.component.js.map