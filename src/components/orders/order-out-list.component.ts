import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, delay, tap, map, takeUntil, takeWhile } from 'rxjs/operators';
import { OrderDataSource } from './order.dataSource';
import { ActivatedRoute } from '@angular/router';
import { OrderProductsDto, OrderDetailDto, ORDER_INITIAL_STATE } from 'src/models/order.dto';
import { ProductDto } from 'src/models/product.dto';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProductOrderDetailModel } from 'src/models/product.model';
import { InventoryItemModel } from 'src/models/inventoryItem.model';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

let subjectSubscriptions = [];

@Component({
    selector: 'app-order-out-list',
    templateUrl: './order-out-list.template.html',
    styleUrls: ['./new-order.component.scss']
})

export class OrderOutListComponent implements OnInit, AfterViewInit {
    @Input() dto: OrderProductsDto;
    @Input() orderDetail: OrderDetailDto;
    @Input() saveSubject: Subject<void>;
    @Input() scanMacAddressSubject: Subject<string>;
    @Input() scanPartNoSubject: Subject<ProductDto[]>;

    paramsId: string;
    itemsList: InventoryItemModel[] = [];
    orderDetailList: OrderDetailDto[] = [];
    addedItemList: InventoryItemModel[] = [];
    allAddedItemsList: any[] = []
    constructor(
        public store: Store,
        public dataSource: OrderDataSource,
        public activatedRoute: ActivatedRoute
    ) {
    }

    validateOrderType() {
        return this.dto.order.orderType['orderDirection'] === 'Out'
    }

    ngOnInit(): void {

    }
    ngAfterViewInit(): void {
        Observable.of()
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

                    subjectSubscriptions.push(
                        this.scanPartNoSubject.pipe(
                            takeWhile(() => this.validateOrderType()),
                            map((matches) => {
                                const partNo = matches.pop().partNumber;
                                this.dataSource.getInventoryItems(partNo)
                                    .subscribe(result => {
                                        console.log('order out', result)
                                        this.itemsList = [...result].filter(x => x.available) as any;
                                    })
                            })
                        ).subscribe()
                    )

                    subjectSubscriptions.push(
                        this.saveSubject.subscribe(data => {
                            this.validateOrderType();
                            if (id) {
                                this.dataSource.updateOrder(
                                    id,
                                    this.dto.order,
                                    this.orderDetail,
                                    this.allAddedItemsList as OrderDetailDto[]
                                ).subscribe(this.postRequest.bind(this))
                            } else {
                                this.dataSource.saveOrder(
                                    this.dto.order,
                                    this.orderDetail,
                                    this.allAddedItemsList as InventoryItemModel[]
                                ).subscribe(this.postRequest.bind(this))
                            }
                        })
                    )
                })
            ).subscribe()
    }

    postRequest(response) {
        console.log(response)
        setTimeout(() => {
            this.store.dispatch(new Navigate(['/orders']))
        }, 2000)
    }

    drop(event: CdkDragDrop<ProductOrderDetailModel[]>) {

        const keyToMove = event.previousContainer.data[event.previousIndex];
        const alreadyExists = this.allAddedItemsList.find((item: any) => {
            return item.serialNumber === keyToMove.serialNumber
        });

        if (alreadyExists) {
            //this.ShowAlert('key already exists.', 2);
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

    ngOnDestroy() {
        if (subjectSubscriptions.length) {
            subjectSubscriptions.forEach(subscription => subscription.unsubscribe())
        }
    }

}