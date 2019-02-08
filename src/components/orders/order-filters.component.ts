import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { ProductService } from 'src/services/barrel';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';

@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    @Input('orderDetail') orderDetail: OrderDetailDto;

    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];

    scanPartNoSubject:Subject<ProductDto[]> = new Subject();
    scanMacAddressSubject:Subject<string> = new Subject();

    constructor(
        private productService: ProductService
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

    canSave () {
        return this.dto.order.ticketNumber !== ''
    }

    scanPartNo (data) {
        const { target: { value } } = data;
        this.productService.getList()
            .subscribe(products => {
                    let matches = [];
                    const result: ProductDto[] = [...products];
                    matches = result.filter(x => x.partNumber === value);
                    this.scanPartNoSubject.next([...matches]);
                }
            )
    }

    scanMacAddress (value: string) {
        this.scanMacAddressSubject.next(value);
    }
}