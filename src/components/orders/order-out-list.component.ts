import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { OrderProductsDto } from 'src/models/order.dto';

@Component({
    selector: 'app-order-out-list',
    templateUrl: './order-out-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderOutListComponent implements OnInit, AfterViewInit {
    @Input('dto') dto: OrderProductsDto;
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
                    this.dataSource.getOrderProducts(id).subscribe();
                })
            )
    }

}