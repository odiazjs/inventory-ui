import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';

@Component({
    selector: 'app-order-out-list',
    templateUrl: './order-out-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderOutListComponent implements OnInit, AfterViewInit {
    @Input() dto: OrderProductsDto;
    @Input() scanPartNoSubject: Subject<ProductDto[]>;
    @Input() scanMacAddressSubject: Subject<any>;

    itemsList: OrderDetailDto[] = [];
    addedItemList: OrderDetailDto[] = [];
    constructor (
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
                    const { snapshot: { params: { id } } } = this.activatedRoute;
                    this.scanPartNoSubject.subscribe(matches => {
                        console.log('matches from child list', matches);
                    })
                    this.scanMacAddressSubject.subscribe(value => {
                        console.log('value from child list', value);
                    })
                })
            ).subscribe()
    }

    ngOnDestroy () {
        this.scanPartNoSubject.unsubscribe();
        this.scanMacAddressSubject.unsubscribe();
    }

}