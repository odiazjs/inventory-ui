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
export var OrderMockService = (function () {
    function OrderMockService() {
    }
    OrderMockService.prototype.getList = function () {
        var orderList = [
            {
                id: 100001,
                createdDate: "2017-05-05",
                notes: "some notes",
                orderNumber: "100001",
                orderDate: "2017-05-05",
                orderState: "Completed",
                orderType: {
                    id: 1,
                    name: "Buy"
                },
                ticketNumber: "10000001"
            },
            {
                id: 100002,
                createdDate: "2017-05-05",
                notes: "some notes",
                orderNumber: "100001",
                orderDate: "2017-05-05",
                orderState: "Completed",
                orderType: {
                    id: 1,
                    name: "Buy"
                },
                ticketNumber: "10000002"
            },
            {
                id: 100003,
                createdDate: "2017-05-05",
                notes: "some notes",
                orderNumber: "100001",
                orderDate: "2017-05-05",
                orderState: "Completed",
                orderType: {
                    id: 1,
                    name: "Buy"
                },
                ticketNumber: "10000003"
            },
            {
                id: 100004,
                createdDate: "2017-05-05",
                notes: "some notes",
                orderNumber: "100001",
                orderDate: "2017-05-05",
                orderState: "Completed",
                orderType: {
                    id: 1,
                    name: "Buy"
                },
                ticketNumber: "10000004"
            }
        ];
        return Observable.of()
            .pipe(startWith(null), delay(2000), map(function () {
            return orderList;
        }));
    };
    OrderMockService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], OrderMockService);
    return OrderMockService;
}());
//# sourceMappingURL=order-mock.service.js.map