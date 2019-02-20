import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { ProductDto } from 'src/models/product.dto';
import { OrderProductsDto, OrderDetailDto, ORDER_INITIAL_STATE, ORDER_PRODUCTS_INITIAL_STATE, ORDER_DETAIL_IDS_CATALOGS_DEFAULT } from 'src/models/order.dto';
import { KeysPipe } from 'src/common/keys.pipe';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ProductModel } from '../../models/product.model';
import { CatalogDto } from '../types';
import { NotificationService, Message, AlertType } from 'src/services/notifications.service';
import { DestroySubscribers } from 'src/common/destroySubscribers';

@Component({
    selector: 'app-order-in-list',
    templateUrl: './order-in-list.template.html',
    styleUrls: ['./new-order.component.scss']
})
@DestroySubscribers()
export class OrderInListComponent implements OnInit, AfterViewInit {

    @Input() saveSubject: Subject<void>;
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    @Input('selectedProductKey') selectedProductKey: string;
    @Input() orderDetailMap: any;
    @Input() scanMacAddressSubject: Subject<string>;
    @Input() scanPartNoSubject: Subject<ProductDto[]>;
    @Output('selectedProductKeyChange') selectedProductKeyEmit: EventEmitter<string> = new EventEmitter<string>();


    public macAddress = '';
    public productMatches: ProductDto[] = [];
    scannedPartNo = this.selectedProductKey;
    paramsId: string; OrderProductsDto
    catalogs: any = {};

    public subscribers: any = {};

    constructor(
        public store: Store,
        public dataSource: OrderDataSource,
        public activatedRoute: ActivatedRoute,
        public notificationService: NotificationService,
    ) {
    }
    ngOnInit(): void {
        setTimeout(() => {
            this.dto.order = ORDER_INITIAL_STATE();
            this.dataSource.orderDetailIds = ORDER_DETAIL_IDS_CATALOGS_DEFAULT;
        })
    }
    ngAfterViewInit(): void {
        this.subscribers.all = Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    const { snapshot: { params: { id } } } = this.activatedRoute;
                    this.paramsId = id;
                    let cataloguesConfig: any;
                    console.log(this.catalogs)
                    if (id) {
                        this.fillCatalogs()
                        this.dataSource.getOrderById(id)
                            .subscribe(result => {
                                console.log(this.catalogs);
                                this.dto.order = Object.assign({}, result.order);
                                result.products.forEach(item => {
                                    this.handleProductDict(item.product as any);
                                })
                                result.products.forEach(item => {
                                    const qtyCounter = 0;
                                    cataloguesConfig = {
                                        warehouse: this.catalogs.warehouses.find(x => x.id === item.warehouse) as CatalogDto,
                                        inventory: this.catalogs.inventories.find(x => x.id === item.inventory),
                                        onInventoryStatus: this.catalogs.inventoryStatuses.find(x => x.id === item.onInventoryStatus),
                                        itemStatus: this.catalogs.itemStatuses.find(x => x.id === item.itemStatus)
                                    }
                                    this.handleProductItems(qtyCounter + 1, item, cataloguesConfig);
                                })

                            })
                    } else {
                        this.dto.order = ORDER_INITIAL_STATE()
                        this.dto.products = []
                    }
                    const addNotification = (id) => {
                        const message: Message = {
                            body: `Order Id: ${id} has been saved succesfully!`,
                            timeout: 2000,
                            type: AlertType.success
                        }
                        this.notificationService.push(message)
                        this.store.dispatch(new Navigate(['/orders']))
                    }
                    this.subscribers.saveSubscription = this.saveSubject.subscribe(data => {
                        if (this.paramsId) {
                            const dto = Object.assign({}, this.dto.order)
                            this.dataSource.updateOrderIn(this.paramsId, dto, this.dto.products)
                                .subscribe(response => {
                                    this.dto = ORDER_PRODUCTS_INITIAL_STATE;
                                    console.log('saved order dto ---> ', response);
                                    addNotification(response.order.id);
                                })
                        } else {
                            const dto = Object.assign({}, this.dto.order)
                            this.dataSource.saveOrderIn(dto, this.dto.products)
                                .subscribe(response => {
                                    console.log('saved order dto ---> ', response);
                                    addNotification(response.order.id);
                                })
                        }
                    })
                    this.subscribers.scanSubscripton = this.scanPartNoSubject.subscribe((matches) => {
                        const product: ProductModel = [...matches].shift()
                        this.handleProductDict(product)
                    })

                    this.subscribers.scanMacAddressSubscription = this.scanMacAddressSubject.subscribe(
                        (productItem) => {
                            const orderDetail = Object.assign({}, this.orderDetail)
                            this.handleProductItems(1, productItem, orderDetail)
                        }
                    )
                })
            ).subscribe();
    }

    removeitem(productKey: string, serialNumber: string) {
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
    }

    deleteProduct(item: any) {
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
        this.dto.products = this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];

    }

    handleProductDict(product: ProductModel) {
        this.toggleProductKey(product.partNumber)
        const { partNumber } = product;
        if (!this.orderDetailMap[partNumber]) {
            this.orderDetailMap[partNumber] = [];
        }
        this.selectedProductKey = product.partNumber;
        this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];
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
            warehouseCat: orderDetail.warehouse,
            inventoryCat: orderDetail.inventory,
            itemStatusCat: orderDetail.itemStatus,
            onInventoryStatusCat: orderDetail.onInventoryStatus,
            assignedUser: this.dto.order.createdBy
        };
        this.orderDetailMap[partNumber].push(orderConfig);
        this.dto.products = [...KeysPipe.pipe(this.orderDetailMap)];
    }

    fillCatalogs() {
        this.dataSource.getOrderCatalogs()
            .subscribe(result => {
                this.catalogs = Object.assign({}, result);
            })
    }
}