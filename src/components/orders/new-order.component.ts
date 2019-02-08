import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';

@Component({
    selector: 'app-new-order-list',
    templateUrl: './new-order.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class NewOrderComponent implements OnInit, AfterViewInit {
    constructor () {

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
            )
    }

}