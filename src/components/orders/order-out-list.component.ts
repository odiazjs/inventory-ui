import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap, map, takeWhile } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { OrderProductsDto, OrderDetailDto, ORDER_INITIAL_STATE, ORDER_DETAIL_IDS_CATALOGS_DEFAULT, ORDER_DETAIL_INITIAL_STATE, ORDER_PRODUCTS_INITIAL_STATE } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProductOrderDetailModel } from 'src/models/product.model';
import { InventoryItemModel } from 'src/models/inventoryItem.model';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Message, AlertType, NotificationService } from 'src/services/notifications.service';
import { DestroySubscribers } from 'src/common/destroySubscribers';


@Component({
    selector: 'app-order-out-list',
    templateUrl: './order-out-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

@DestroySubscribers()
export class OrderOutListComponent implements OnInit, AfterViewInit {
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    @Input() saveSubject: Subject<void>;
    @Input() searchByMacAddressSubject: Subject<any>;
    @Input() scanPartNoSubject: Subject<ProductDto[]>;

    paramsId: string;
    subscribers: any = {};
    fetchedList: InventoryItemModel[] = [];
    allAddedItemsList: InventoryItemModel[] = [];
    itemsList: InventoryItemModel[] = [];
    orderDetailList: OrderDetailDto[] = [];

    constructor(
        public store: Store,
        public dataSource: OrderDataSource,
        public activatedRoute: ActivatedRoute,
        private notificationService: NotificationService
    ) {
    }

    validateOrderType() {
        return this.dto.order.orderType['orderDirection'] === 'Out'
    }

    ngOnInit(): void {
        console.log('init')
    }
    ngAfterViewInit(): void {
        this.dto = Object.assign({}, ORDER_PRODUCTS_INITIAL_STATE) as any
        this.dataSource.orderDetailIds = ORDER_DETAIL_IDS_CATALOGS_DEFAULT;
        this.subscribers.all = Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    const { snapshot: { params: { id } } } = this.activatedRoute;
                    this.paramsId = id;
                    if (id) {
                        this.dataSource.getOrderById(id)
                            .subscribe(result => {
                                console.log(result);
                                this.dto.order = Object.assign({}, result.order);
                                this.orderDetailList = [...result.products] as any;
                                this.allAddedItemsList = [...result.products] as any;
                            })
                    } else {
                        this.dto.order = ORDER_INITIAL_STATE()
                        this.dto.products = []
                        this.allAddedItemsList = [];
                    }

                    this.subscribers.scanPartNoSubs = this.scanPartNoSubject.pipe(
                        takeWhile(() => this.validateOrderType()),
                        map((matches) => {
                            const partNo = matches.pop().partNumber;
                            this.dataSource.getInventoryItems(partNo)
                                .subscribe(result => {
                                    this.fetchedList = [...result].filter(x => x.available) as any;
                                    this.itemsList = [...result].filter(x => x.available) as any;
                                })
                        })
                    ).subscribe()

                    this.subscribers.searchByMacAddressSubject = this.searchByMacAddressSubject.pipe(
                        takeWhile(() => this.validateOrderType()),
                        map(({ value, isClear }) => {
                            if (isClear) {
                                this.itemsList = [...this.fetchedList]
                            } else {
                                this.itemsList = [...this.itemsList.filter(item =>
                                    item.product.partNumber.includes(value) || item.serialNumber.includes(value))
                                ]
                            }
                        })
                    ).subscribe();

                    this.subscribers.saveSub = this.saveSubject.pipe(
                        takeWhile(() => this.validateOrderType()),
                        map(() => {
                            if (id) {
                                this.dataSource.updateOrder(
                                    id,
                                    this.allAddedItemsList as OrderDetailDto[]
                                ).subscribe(this.postRequest.bind(this))
                            } else {
                                this.dataSource.saveOrder(
                                    this.allAddedItemsList as InventoryItemModel[]
                                ).subscribe(this.postRequest.bind(this))
                            }
                        })
                    ).subscribe()
                })
            ).subscribe()
    }

    getInventoryItems(partNo) {
        this.dataSource.getInventoryItems(partNo)
            .subscribe(result => {
                this.itemsList = [...result].filter(x => x.available) as any;
            })
    }

    postRequest(response) {
        const message: Message = {
            body: `Order Id: ${response.order.id} has been saved succesfully!`,
            timeout: 2000,
            type: AlertType.success
        }
        this.notificationService.push(message)
        this.store.dispatch(new Navigate(['/orders']))
    }

    drop(event: CdkDragDrop<ProductOrderDetailModel[]>) {

        const keyToMove = event.previousContainer.data[event.previousIndex];
        const alreadyExists = this.allAddedItemsList.find((item: any) => {
            return item.serialNumber === keyToMove.serialNumber
        });

        if (alreadyExists) {
            const message: Message = {
                body: `Item already exists in selected items.`,
                type: AlertType.warning
            }
            this.notificationService.push(message)
            return;
        };

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

}