import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import {
    ORDER_INITIAL_STATE,
    DEFAULT_ORDER_TYPES,
    ORDER_DETAIL_INITIAL_STATE,
    DEFAULT_ORDER_SUBTYPES
} from 'src/models/order.dto';

@Component({
    selector: 'app-order-header',
    templateUrl: './order-header.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderHeaderComponent implements OnInit, AfterViewInit {
    model = ORDER_INITIAL_STATE();
    catalogs: any = {};
    orderTypes = DEFAULT_ORDER_TYPES;
    orderDirection = '';
    orderSubTypes = [];
    orderDetail = {};
    constructor(
        public dataSource: OrderDataSource,
        public activatedRoute: ActivatedRoute
    ) {
    }
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    this.fillCatalogs();
                    this.model = ORDER_INITIAL_STATE(this.catalogs);
                })
            ).subscribe()
    }

    checkOrderType(index) {
        return this.orderDirection == this.orderTypes[index].orderDirection
    }

    fillCatalogs() {
        this.dataSource.getOrderCatalogs()
            .subscribe(result => {
                console.log(result);
                this.catalogs = Object.assign({}, result);
                this.orderSubTypes = DEFAULT_ORDER_SUBTYPES(this.catalogs);
                this.orderDetail = ORDER_DETAIL_INITIAL_STATE(this.catalogs);
            })
    }

    filterOrderSubTypes() {
        const markAs = (this.orderDirection === 'In') ? 'INPUT' : 'OUTPUT';
        this.orderSubTypes = [...this.orderSubTypes.filter(x => x.orderDirection === this.orderDirection)];
        this.catalogs.inventoryStatuses = [...this.catalogs.inventoryStatuses.filter(x => x.markAs === markAs)]
    }

    switchRadioBtns(ev, newValue) {
        this.orderDirection = newValue.orderDirection;
        this.fillCatalogs();
        this.filterOrderSubTypes();
    }

}