import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { ProductService } from 'src/services/barrel';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { OrderOutListComponent } from './order-out-list.component';

@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    @Input('orderDetail') orderDetail: OrderDetailDto;

    @ViewChild(OrderOutListComponent)
    public orderOurListComponent: OrderOutListComponent

    saveEvent: Event;
    showCompleteConfirmation: boolean = false;

    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];

    onSaveSubject: Subject<void> = new Subject();
    scanPartNoSubject: Subject<ProductDto[]> = new Subject();
    scanMacAddressSubject: Subject<string> = new Subject();

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
        return this.dto.order.ticketNumber !== '' && this.orderOurListComponent.allAddedItemsList.length
    }

    saveCompleteConfirmtation (ev:Event) {
        this.saveEvent = ev;
        if (this.dto.order.orderState === 'Completed') {
            this.showCompleteConfirmation = true;
        } else {
            this.save();
        }
    }

    save () {
        this.onSaveSubject.next();
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