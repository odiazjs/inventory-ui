import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { ProductService } from 'src/services/barrel';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { KeysPipe } from 'src/common/keys.pipe';
import { Dictionary } from 'src/components/types';
import { ProductOrderDetailModel, ProductModel } from '../../models/product.model';
import { OrderOutListComponent } from './order-out-list.component';

@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    @Input('orderDetail') orderDetail: OrderDetailDto;

    orderConfig: OrderDetailDto = this.orderDetail;

    @ViewChild(OrderOutListComponent)
    public orderOurListComponent: OrderOutListComponent

    saveEvent: Event;
    showCompleteConfirmation: boolean = false;
    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];
    orderDetailMap: Dictionary<any[]> = {};
    scannedSerialNo: string = '';
    result: ProductModel[]
    selectedProductKey: string;

    onSaveSubject: Subject<void> = new Subject();
    scanPartNoSubject: Subject<ProductDto[]> = new Subject();
    scanMacAddressSubject: Subject<any> = new Subject();

    constructor(
        private productService: ProductService
    ) {

    }
    ngOnInit(): void {
        this.productService.getList()
        .subscribe(products => {
            this.result = [...products];
        })
    }
    ngAfterViewInit(): void {
        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    // setInterval(() => {
                    //     console.log(this.selectedProductKey)
                    // }, 2500)
                })
            ).subscribe();
    }

    canSave() {
        if (this.dto.order.orderType['orderDirection'] === 'In') {
            return this.dto.products.length
        }
        return this.orderOurListComponent && this.orderOurListComponent.allAddedItemsList.length
    }

    saveCompleteConfirmtation(ev: Event) {
        this.saveEvent = ev;
        if (this.dto.order.orderState === 'Completed') {
            this.showCompleteConfirmation = true;
        } else {
            this.save();
        }
    }

    save() {
        this.onSaveSubject.next();
    }

    scanPartNo(data) {
        const { target: { value } } = data;
        this.selectedProductKey = value;
        if (data !== '' || data !== null) {
            this.productService.getList()
                .subscribe(products => {
                    let matches = [];
                    this.result = [...products];
                    matches = this.result.filter(x => x.partNumber === value);
                    if (matches.length) {
                        this.scanPartNoSubject.next([...matches]);
                    } else {
                        // make an alert here
                        console.log('Product not found')
                    }
                })
        }
    }

    scanMacAddress(value: string) {
        if (this.orderDetailMap[this.selectedProductKey].find(y => y.serialNumber === value)) {
            console.log('This item already exist on this order');
            return
        }
        if (value === null || value === '') {
            console.log('MAC Address can\'t be empty', 0);
            return
        }
        const matches = this.result.filter(x => x.partNumber === this.selectedProductKey);
        const productItem: any = { product: [...matches].shift() };
        productItem.serialNumber = value;
        this.scannedSerialNo = '';
        this.scanMacAddressSubject.next(productItem);
    }


    handleProductItems(qtyCounter, item, orderDetail) {
        // console.log('handle product item ', item)
        const { order, serialNumber, product: { partNumber, id, name, avgPrice } } = item;
        const orderConfig = {
            id: item.product.id,
            order,
            serialNumber,
            partNumber,
            product: id,
            name: name,
            quantity: qtyCounter + 1,
            price: avgPrice,
            warehouseCat: this.orderDetail.warehouse,
            inventoryCat: this.orderDetail.inventory,
            itemStatusCat: this.orderDetail.itemStatus,
            onInventoryStatusCat: this.orderDetail.onInventoryStatus
        };
        this.orderDetailMap[partNumber].push(orderConfig);
        this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];
    }
}
