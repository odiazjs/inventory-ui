import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { ProductDto } from 'src/models/product.dto';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';

@Component({
    selector: 'app-order-in-list',
    templateUrl: './order-in-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderInListComponent implements OnInit, AfterViewInit {
    
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    
    public macAddress = '';
    public productMatches: ProductDto[] = [];
    
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
                    
                })
            ).subscribe();
    }

}