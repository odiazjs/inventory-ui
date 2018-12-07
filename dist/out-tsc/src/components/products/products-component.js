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
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { startWith, delay } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
export var ProductsComponent = (function () {
    function ProductsComponent(productService) {
        this.productService = productService;
        this.lineChart = [];
        this.productsList = [];
    }
    ProductsComponent.prototype.newProduct = function () {
    };
    ProductsComponent.prototype.getAllProducts = function () {
        var _this = this;
        Observable.of().pipe(startWith(null), delay(0)).subscribe(function () {
            _this.productService.getList()
                .subscribe(function (result) {
                console.log('products -----> ', result);
                _this.productsList = result.slice();
            });
        });
    };
    ProductsComponent.prototype.ngAfterContentInit = function () {
        //get all products
        this.getAllProducts();
        // line chart
        var lineEl = document.getElementById('lineChart');
        var lineCtx = lineEl.getContext('2d');
        Chart.defaults.global.defaultFontFamily = 'Titillium Web';
        function hoursEarlier(hours) {
            return moment().subtract(hours, 'h').toDate();
        }
        ;
        var speedData = {
            labels: [hoursEarlier(10), hoursEarlier(9.4), hoursEarlier(8), hoursEarlier(7), hoursEarlier(6), hoursEarlier(5), hoursEarlier(4)],
            datasets: [
                {
                    label: "",
                    data: [0, 59, 75, 20, 20, 55, 40],
                    borderWidth: 2,
                    lineTension: 0,
                    fill: false,
                    borderColor: 'orange',
                    backgroundColor: 'transparent',
                    pointBorderColor: 'orange',
                    pointBackgroundColor: 'orange',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    pointHitRadius: 30,
                    pointBorderWidth: 1,
                    pointStyle: 'rounded'
                },
                {
                    label: "",
                    data: [10, 20, 41, 90, 10, 56, 98],
                    borderWidth: 2,
                    lineTension: 0,
                    fill: false,
                    borderColor: 'deepskyblue',
                    backgroundColor: 'transparent',
                    pointBorderColor: 'deepskyblue',
                    pointBackgroundColor: 'deepskyblue',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    pointHitRadius: 30,
                    pointBorderWidth: 1,
                    pointStyle: 'rounded'
                },
                {
                    label: "",
                    data: [80, 40, 70, 20, 30, 86, 12],
                    borderWidth: 2,
                    lineTension: 0,
                    fill: false,
                    borderColor: 'crimson',
                    backgroundColor: 'transparent',
                    pointBorderColor: 'crimson',
                    pointBackgroundColor: 'crimson',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    pointHitRadius: 30,
                    pointBorderWidth: 1,
                    pointStyle: 'rounded'
                }
            ]
        };
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                position: 'top',
                labels: {
                    boxWidth: 50,
                    fontColor: '#424242'
                }
            },
            scales: {
                xAxes: [{
                        type: "time",
                        time: {
                            unit: 'hour',
                            unitStepSize: 0.6,
                            round: 'hour',
                            tooltipFormat: "h:mm:ss a",
                            displayFormats: {
                                hour: 'MMM D, h:mm A'
                            }
                        }
                    }],
                yAxes: [{
                        gridLines: {
                            color: "black"
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "# Units",
                            fontColor: "green"
                        }
                    }]
            }
        };
        this.lineChart = new Chart(lineCtx, {
            type: 'line',
            data: speedData,
            options: chartOptions
        });
    };
    ProductsComponent = __decorate([
        Component({
            selector: 'app-products',
            templateUrl: './products.template.html',
            styleUrls: ['./products.component.scss']
        }), 
        __metadata('design:paramtypes', [ProductService])
    ], ProductsComponent);
    return ProductsComponent;
}());
//# sourceMappingURL=products-component.js.map