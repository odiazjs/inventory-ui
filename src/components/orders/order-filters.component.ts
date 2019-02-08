import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { ProductService } from 'src/services/barrel';
import { OrderProductsDto } from 'src/models/order.dto';
import { OrderInListComponent } from './order-in-list.component';

@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    
    @ViewChild(OrderInListComponent)
    orderInListComponent: OrderInListComponent;

    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];

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
                    setInterval(() => {
                        console.log(this.dto)
                    }, 1500)
                })
            ).subscribe();
    }

    canSave() {
        return this.dto.order.ticketNumber !== ''
    }

    scanPartNo(data) {
        const { target: { value } } = data;
        return this.productService.getList()
            .subscribe(products => {
                    let matches = [];
                    const result: any[] = [...products];
                    matches = result.filter(x => x.partNumber === value);
                    console.log(matches)
                    this.orderInListComponent.productMatches = [...matches];
                    return matches;
                }
            )
    }

    scanMacAddress (value: string) {
        this.orderInListComponent.macAddress = value;
    }
}