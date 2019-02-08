import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderProductsDto, ORDER_INITIAL_STATE } from 'src/models/order.dto';

@Component({
    selector: 'app-new-order-list',
    templateUrl: './new-order.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class NewOrderComponent implements OnInit, AfterViewInit {

    enableSave: boolean;
    dto: OrderProductsDto = {
        order: ORDER_INITIAL_STATE(),
        products: []
    };

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

    canSave() {
        return true
    }

    ShowAlert(messageToShow: string, type: number) {
        if (type === 0) {
            this.showError = true;
            this.showMessage = true
            this.alertMessage = messageToShow;
        } else if (type === 1) {
            this.showInfo = true;
            this.showMessage = true
            this.alertMessage = messageToShow;
        } // used to keep the error message on the display
        else if (type === 2) {
            this.showMessage = true;
            this.showError = true;
            this.alertMessage = messageToShow;
        }
        else if (type === 3) {
            this.showMessage = true;
            this.showInfo = true;
            this.alertMessage = messageToShow;
        }
        setTimeout(() => {
            this.showMessage = false;
            this.showError = false
        }, 4500);
    }

}