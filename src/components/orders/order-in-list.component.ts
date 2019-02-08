import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
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
    
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    @Input() selectedProductKey: string;
    @Input() orderDetailMap: any;

     
    public macAddress = '';
    public productMatches: ProductDto[] = [];
    scannedPartNo = this.selectedProductKey;
    scannedSerialNo = '';
    
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
                    // setInterval(()=>{
                    //     console.log('dto list in', this.dto)
                    // },2500)
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
        // coul use a emiter to change the value in the parent
    }

    deleteProduct(item: any) {
        console.log(item)
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
        this.dto.products = this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];

    }


}