import { ProductService, NotificationService, AlertType, Message, OrderDataSource } from 'src/services/barrel';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderProductsDto, OrderDetailDto } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { KeysPipe } from 'src/common/keys.pipe';
import { Dictionary } from 'src/components/types';
import { ProductModel } from '../../models/product.model';
import { OrderOutListComponent } from './order-out-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-filters',
    templateUrl: './order-filters.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderFiltersComponent implements OnInit, AfterViewInit {

    @Input('dto') dto: OrderProductsDto;
    @Input('orderDetail') orderDetail: OrderDetailDto;
    @ViewChild('scaninput') macField: ElementRef;


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
    filtersOrderState = this.orderStates[0];
    orderDetailMap: Dictionary<any[]> = {};
    scannedSerialNo: string = '';
    result: ProductModel[]
    selectedProductKey: string;

    onSaveSubject: Subject<void> = new Subject();
    scanPartNoSubject: Subject<ProductDto[]> = new Subject();
    scanMacAddressSubject: Subject<any> = new Subject();
    searchByMacAddressSubject: Subject<any> = new Subject();

    constructor(
        public dataSource: OrderDataSource,
        public activatedRoute: ActivatedRoute,
        private productService: ProductService,
        private notificationService: NotificationService
    ) {

    }
    ngOnInit(): void {
        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    this.productService.getList()
                        .subscribe(products => {
                            this.result = [...products];
                        })
                    const { snapshot: { params: { id, orderType } } } = this.activatedRoute;
                    this.dto.order.orderType['orderDirection'] = orderType;
                })
            ).subscribe();
    }
    ngAfterViewInit(): void {
        
    }

    changeSaveAs (event) {
        //
    }

    canSave() {
        return [...KeysPipe.pipe(this.orderDetailMap)].length;
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
                        this.setFocusOnScanner()
                    } else {
                        // make an alert here
                        const message: Message = {
                            body: `Product: ${value}, not found!`,
                            timeout: 2500,
                            type: AlertType.error
                        }
                        this.notificationService.push(message)
                    }
                })
        }
    }

    scanMacAddress(value: string) {
        if (!this.orderDetailMap[this.selectedProductKey] && this.dto.order.orderType['orderDirection'] === 'In' ) {
            this.notificationService.push({
                body: 'Please enter a EAN or Part Number first.', 
                type: AlertType.info
            })
            return;
        }
        if (this.dto.order.orderType['orderDirection'] === 'In') {
            if (this.orderDetailMap[this.selectedProductKey].find(y => y.serialNumber === value)) {
                this.notificationService.push({
                    body: 'This item already exists in this order', 
                    type: AlertType.warning
                })
                return
            }
        }
        if (value === null || value === '') {
            this.notificationService.push({
                body: 'MAC Address can\'t be empty', 
                type: AlertType.warning
            })
            return
        }
        const matches = this.result.filter(x => x.partNumber === this.selectedProductKey);
        const productItem: any = { product: [...matches].shift() };
        productItem.serialNumber = value;
        this.scannedSerialNo = '';
        this.scanMacAddressSubject.next({ value, productItem });
    }

    searchByMacAddress (value: string, isClear: boolean) {
        this.searchByMacAddressSubject.next({value, isClear})
    }


    handleProductItems(qtyCounter, item, orderDetail) {
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
    setFocusOnScanner(): void{
        this.macField.nativeElement.focus()
    }
}
