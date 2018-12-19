import { Component, AfterContentInit, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { startWith, delay } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ProductModel } from '../../models/product.model';
import { CatalogModel } from 'src/models/order.dto';
import { CatalogsService, ProductSearchService } from 'src/services/barrel';

@Component({
    selector: 'app-products',
    templateUrl: './products.template.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterContentInit, OnInit {
    lineChart: Array<any> = [];
    productsList: Array<ProductModel> = []
    productSearchName: string;
    productSearchManufacturer: string;
    productSeachGroup: string;

    manufacturers: CatalogModel[] = [];
    productsGroup: CatalogModel[] = [];
    filterValues: any = {};

    constructor(
        private productService: ProductService,
        private catalogService: CatalogsService,
        private productSearchService: ProductSearchService
        ) { }

    getAllProducts() {
        Observable.of().pipe(startWith(null), delay(0)).subscribe(() => {
            this.productService.getList()
                .subscribe((result: any) => {
                    console.log('products -----> ', result);
                    this.productsList = [...result]
                })
        })
    }

    ngOnInit(): void {
        Observable.of().pipe(startWith(null), delay(0)).subscribe(() => {
            this.catalogService.getManufacturers()
                .subscribe((result: any) => {
                    this.manufacturers = [...result]
                    this.manufacturers.push({code: '', enabled: true, name: 'All', id: 0});
                })
        })
        Observable.of().pipe(startWith(null), delay(0)).subscribe(() => {
            this.catalogService.getProductsGroups()
                .subscribe((result: any) => {
                    this.productsGroup = [...result]
                    // todo: find a better way to add 'All' to the list
                    this.productsGroup.push({code: '', enabled: true, name: 'All', id: 0});
                    this.filterValues = {
                        manufacturersCat: this.manufacturers[this.manufacturers.length - 1],
                        productsGroupCat: this.productsGroup[this.productsGroup.length - 1]
                    }
                })
        })
    }

    ngAfterContentInit(): void {

        // get all products
        this.getAllProducts();

        // line chart
        const lineEl = <HTMLCanvasElement>document.getElementById('lineChart');
        const lineCtx = lineEl.getContext('2d');
        Chart.defaults.global.defaultFontFamily = 'Titillium Web';

        function hoursEarlier(hours) {
            return moment().subtract(hours, 'h').toDate();
        };

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
    }

    searchProduct() {
        const dto: any = {}
        console.log('searching:', this.productSearchName);
        if (this.filterValues.manufacturersCat.id !== 0 ) {
            console.log('searching product manufacturer', this.filterValues.manufacturersCat.name);
            dto.manufacturer = this.filterValues.manufacturersCat.name;
        }
        if (this.filterValues.productsGroupCat.id !== 0) {
            console.log('searching product group', this.filterValues.productsGroupCat.name);
            dto.group = this.filterValues.productsGroupCat.name;
        }
        if (this.productSearchName !== undefined && this.productSearchName !== '') {
            console.log('searching product name', this.productSearchName);
            dto.name = this.productSearchName;
        }
        this.productSearchService.getList(dto)
        .subscribe( (result: any) => {
            this.productsList = [...result]
        });
        console.log('dto', dto)
    }
}
