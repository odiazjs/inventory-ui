import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderProductsDto, ORDER_PRODUCTS_INITIAL_STATE } from 'src/models/order.dto';

@Component({
    selector: 'app-new-order-list',
    templateUrl: './new-order.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class NewOrderComponent implements OnInit, AfterViewInit {

    dto: OrderProductsDto = Object.assign({}, ORDER_PRODUCTS_INITIAL_STATE);

    showError = false;
    alertMessage: string;
    showSuccess = false;
    showInfo = false;
    showMessage = false;
    productList: any;
    showCompleteConfirmation = false;
    saveEvent: Event;

    constructor() {

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
            ).subscribe()
    }

}