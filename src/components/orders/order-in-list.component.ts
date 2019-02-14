import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { ProductDto } from 'src/models/product.dto';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { KeysPipe } from 'src/common/keys.pipe';


@Component({
    selector: 'app-order-in-list',
    templateUrl: './order-in-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderInListComponent implements OnInit, AfterViewInit {

    @Input() saveSubject: Subject<void>;
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    @Input('selectedProductKey') selectedProductKey: string;
    @Input() orderDetailMap: any;
    @Output('selectedProductKeyChange') selectedProductKeyEmit: EventEmitter<string> = new EventEmitter<string>();


    public macAddress = '';
    public productMatches: ProductDto[] = [];
    scannedPartNo = this.selectedProductKey;

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
                    this.saveSubject.subscribe(data => {
                        console.log(this.dto)
                        this.dataSource.saveOrderIn(this.dto.order, this.orderDetail, this.dto.products)
                        .subscribe(response => {
                            console.log('saved order dto ---> ', response);
                        })
                    })
                })
            ).subscribe();
    }

    removeitem(productKey: string, serialNumber: string){
        const item = this.orderDetailMap[productKey].find(y => y.serialNumber === serialNumber)
        const values = this.orderDetailMap[productKey]
        const index = values.indexOf(item)
        const newValues = values.slice(0, index).concat(values.slice(index + 1))
        this.orderDetailMap[item.partNumber] = [...newValues]
        this.dto.products = this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];
    }
    
    toggleProductKey(key: string) {
        this.selectedProductKey = key;
        this.selectedProductKeyEmit.emit(this.selectedProductKey);
        // coul use a emiter to change the value in the parent
    }

    deleteProduct(item: any) {
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
        this.dto.products = this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];

    }


}