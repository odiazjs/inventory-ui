import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import {
    DEFAULT_ORDER_TYPES,
    ORDER_DETAIL_INITIAL_STATE,
    DEFAULT_ORDER_SUBTYPES,
    OrderProductsDto,
} from 'src/models/order.dto';

@Component({
    selector: 'app-order-header',
    templateUrl: './order-header.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderHeaderComponent implements OnInit, AfterViewInit {
    orderDetail = ORDER_DETAIL_INITIAL_STATE;
    catalogs: any = {};
    orderTypes = DEFAULT_ORDER_TYPES;
    orderDirection = '';
    orderSubTypes = [];

    @Input('dto') dto: OrderProductsDto;

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
                    const { snapshot: { params: { id, orderType } } } = this.activatedRoute;
                    if (id) {
                        this.orderDirection = orderType
                    }
                })
            ).subscribe()
    }

    resolveOrderDirection (orderType) {
        if (typeof this.dto.order.orderType == 'number') {
            this.dto.order.orderType = { orderDirection: orderType } as any
        } else {
            this.dto.order.orderType['orderDirection'] = orderType
        }
    }

    checkOrderType(index) {
        return this.orderDirection == this.orderTypes[index].orderDirection
    }

    fillCatalogs() {
        this.dataSource.getOrderCatalogs()
            .subscribe(result => {
                this.catalogs = Object.assign({}, result);
                this.orderSubTypes = DEFAULT_ORDER_SUBTYPES(this.catalogs);
                this.orderDetail = ORDER_DETAIL_INITIAL_STATE(this.catalogs) as any;
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
        this.resolveOrderDirection(newValue.orderDirection)
    }
    canEdit() {
        if (this.dto.order.orderState === 'Closed') {
            return true
        }
        return false
    }
}
