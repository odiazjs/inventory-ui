import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { ProductService } from 'src/services/barrel';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { KeysPipe } from 'src/common/keys.pipe';
import { Dictionary } from 'src/components/types';
import { ProductOrderDetailModel, ProductModel } from '../../models/product.model';




@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    @Input('orderDetail') orderDetail: OrderDetailDto;
    orderConfig: OrderDetailDto = this.orderDetail;
    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];
    orderDetailMap: Dictionary<any[]> = {};
    scannedSerialNo: string;
    result: ProductModel[]
    selectedProductKey: string;

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
                    // setInterval(() => {
                    //     console.log(this.selectedProductKey)
                    // }, 2500)
                })
            ).subscribe();
    }

    canSave () {
        return this.dto.order.ticketNumber !== ''
    }

    scanPartNo (data) {
        const { target: { value } } = data;
        this.selectedProductKey = value;
        if (data !== '' || data !== null){
            this.productService.getList()
            .subscribe(products => {
                    let matches = [];
                    this.result = [...products];
                    matches = this.result.filter(x => x.partNumber === value);
                    if (matches.length) {
                        const product: ProductModel = [...matches].shift()
                        this.handleProductDict(product);
                        this.scanPartNoSubject.next([...matches]);
                    } else {
                        // make an alert here
                        console.log('Product not found')
                    }
                }
            )
        }
    }

    scanMacAddress (value: string) {
        if (this.orderDetailMap[this.selectedProductKey].find(y => y.serialNumber === value)){
            console.log('This item already exist on this order');
            return
        }
        if (value === null || value === ''){
            console.log('MAC Address can\'t be empty', 0);
            return
        }
        const matches = this.result.filter(x => x.partNumber === this.selectedProductKey);
        const productItem: any = { product: [...matches].shift() };
        productItem.serialNumber = value;
        this.handleProductItems(1, productItem, this.orderDetail)
        this.scannedSerialNo = '';
        this.scanMacAddressSubject.next(value);
    }

    handleProductDict (product: ProductModel) {
        const { partNumber } = product;
        if (!this.orderDetailMap[partNumber]) {
            this.scannedSerialNo = ''
            this.orderDetailMap[partNumber] = [];
        }
        this.selectedProductKey = product.partNumber;
        this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];
    }

    handleProductItems (qtyCounter, item, orderDetail) {
        // console.log('order detail filter', this.orderDetail)
        const { order, serialNumber, product: { partNumber, id, name, avgPrice } } = item;
        const orderConfig = {
            id: item.id,
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
        console.log('products after add',this.dto.products)
    }
}