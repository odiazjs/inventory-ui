import { Component, OnInit } from '@angular/core';
import { OrderProductsModel } from '../../models/order.model';
import { ProductOrderDetailModel, ProductModel } from '../../models/product.model';
import { Subject, Observable } from 'rxjs';
import { map, distinctUntilChanged, flatMap, startWith, delay, tap } from 'rxjs/operators';
import { CatalogModel, OrderProductsDto, CatalogDto } from '../../models/order.dto';
import { ProductService, OrderService, InventoryItemService } from 'src/services/barrel';
import { Dictionary } from 'src/components/types';
import { KeysPipe } from 'src/common/keys.pipe';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'lodash';
import { Store, Select } from '@ngxs/store';
import { GetAll } from 'src/ngxs/models/catalogState.model';
import { Navigate } from '@ngxs/router-plugin';


import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-new-order',
    templateUrl: './new-order.template.html',
    styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

    readonly SCAN_EVENT_PARTNO = "PART_NO";
    readonly SCAN_EVENT_MACADDRESS = "MAC_ADDRESS";
    // used to clear
    scannedSerialNo = '';
    // alerts
    showError = false;
    alertMessage: string;
    showSuccess = false;
    productList: any;
    canSave: boolean = true;

    orderTypes: CatalogModel[] = [
        { id: 1, name: 'In', icon: 'input' },
        { id: 2, name: 'Out', icon: 'input' }
    ];

    orderStates: string[] = [
        'Draft',
        'Completed',
        'Discarded'
    ];

    @Select(state => state.catalogs) catalogs$: Observable<Dictionary<CatalogDto[]>>;

    warehouses: CatalogModel[] = [];
    inventories: CatalogModel[] = [];
    inventoryStatuses: CatalogModel[] = [];
    itemStatuses: CatalogModel[] = [];
    orderSubTypes: CatalogModel[] = [];

    orderProducts: OrderProductsModel = {
        order: {
            orderNumber: null,
            orderType: 1,
            orderDirection: this.orderTypes[0].name,
            orderState: this.orderStates[0],
            orderDate: new Date().toLocaleDateString('en-US'),
            ticketNumber: null,
            notes: 'some notes.'
        },
        orderDetail: {} as any
    };

    selectedProductKey: string;

    onScanSubscription = new Subject<any>();
    orderDetailArray: Array<{ key: any, value: any }> = [];
    orderDetailMap: Dictionary<ProductOrderDetailModel[]> = {};

    availableProductsList: ProductModel[] = [];
    draggedProductList: ProductModel[] = [];

    filterOrderSubTypes = () => {
        return [...this.orderSubTypes.filter(x => x.orderDirection == this.orderProducts.order.orderDirection)];
    }

    initCatalogues = (catalogDictionary: any) => {

        this.warehouses = catalogDictionary['Warehouses'];
        this.inventories = catalogDictionary['Inventories'];
        this.inventoryStatuses = catalogDictionary['InventoryStatus'];
        this.itemStatuses = catalogDictionary['ItemStatus'];
        this.orderSubTypes = catalogDictionary['OrderSubTypes'];

        this.orderSubTypes = this.filterOrderSubTypes();
        this.orderProducts.order.orderType = this.orderSubTypes[0].id;
        this.orderProducts.order.orderDirection = this.orderSubTypes[0].name;

        this.orderProducts.orderDetail = {
            warehouseCat: this.warehouses[0],
            inventoryCat: this.inventories[0],
            onInventoryStatusCat: this.inventoryStatuses[0],
            itemStatusCat: this.itemStatuses[0]
        }
    }

    constructor(
        private store: Store,
        public productService: ProductService,
        public inventoryItemService: InventoryItemService,
        public orderService: OrderService,
        public activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.productService.getList()
            .subscribe((products) => { this.productList = products });

        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    this.catalogs$.subscribe(catalogDictionary => {
                        if (isEmpty(catalogDictionary)) {
                            this.store.dispatch(new GetAll())
                                .subscribe(result => {
                                    this.initCatalogues(result.catalogs)
                                })
                        } else {
                            this.initCatalogues(catalogDictionary);
                        }
                    });
                }),
                tap(() => {
                    // check if its an order update
                    const params = this.activatedRoute.snapshot.params;
                    if (params.id) {
                        this.orderService.getById(params.id)
                            .subscribe(result => {
                                console.log('get order by id', result);
                                this.orderProducts.order = result.order;
                                result.products.forEach(item => {
                                    this.handleProductDict(item.product as any);
                                })
                                result.products.forEach(item => {
                                    const qtyCounter = 0;
                                    const cataloguesConfig = {
                                        warehouseCat: this.warehouses.find(x => x.id === item.warehouse),
                                        inventoryCat: this.inventories.find(x => x.id === item.inventory),
                                        onInventoryStatusCat: this.inventoryStatuses.find(x => x.id === item.onInventoryStatus),
                                        itemStatusCat: this.itemStatuses.find(x => x.id === item.itemStatus)
                                    }
                                    this.handleProductItems(qtyCounter + 1, item, cataloguesConfig);
                                })
                                // disable save button if is not a draft and show a message
                                console.log('orderstate', this.orderProducts.order.orderState)
                                if (result.order.orderState !== 'Draft') {
                                    this.canSave = false;
                                    this.ShowAlert('Only view, any change made to this order won\'t be saved', 3);
                                }
                            })
                    }
                })
            ).subscribe();

        let product: ProductModel;
        const onScan$ =
            this.onScanSubscription.pipe(
                map((data: any) => {
                    const { event: { target: { value } }, message } = data
                    return { value, message }
                }),
                distinctUntilChanged(),
                flatMap((eventData) => Observable.of(eventData))
            ).subscribe((eventData) => {
                if (isEmpty(eventData.value.trim())) return;
                const { value, message } = eventData;
                if (this.orderProducts.order.orderDirection == "Out") {
                    this.inventoryItemService.getList()
                        .subscribe((items) => {
                            this.availableProductsList = [...items] as any;
                        });
                } else {
                    this.productService.getList()
                        .subscribe((products) => {
                            this.productList = [...products]
                            let matches = [];
                            const result: any[] = this.productList;
                            switch (message) {
                                case this.SCAN_EVENT_PARTNO:
                                    matches = result.filter(x => x.partNumber === value);
                                    if (matches.length) {
                                        this.showError = false;
                                        product = [...matches].shift();
                                        this.handleProductDict(product);
                                    } else {
                                        this.ShowAlert('Product Not Found!!', 2)
                                    }
                                    break;
                                case this.SCAN_EVENT_MACADDRESS:
                                    const qtyCounter = 0;
                                    matches = result.filter(x => x.partNumber === this.selectedProductKey);
                                    const productItem: any = { product: [...matches].shift() };
                                    productItem.serialNumber = value;
                                    this.handleProductItems(qtyCounter, productItem, this.orderProducts.orderDetail)
                                    // clear the field after the insertion.
                                    this.scannedSerialNo = '';
                                    break;
                            }
                        });
                }
            });

        onScan$.remove(onScan$);
    }



    removeitem(productKey: string, serialNumber: string) {
        const item = this.orderDetailArray.find(x => x.key === productKey).value.find(y => y.serialNumber === serialNumber)
        const values = this.orderDetailArray.find(x => x.key === productKey).value
        const index = values.indexOf(item)
        const newValues = values.slice(0, index).concat(values.slice(index + 1))
        this.orderDetailArray.find(x => x.key === productKey).value = [...newValues]


    }

    addItem(value: string) {
        let matches = [];
        const result: any[] = this.productList;
        const qtyCounter = 0;
        matches = result.filter(x => x.partNumber === this.selectedProductKey);
        const productItem: any = { product: [...matches].shift() };
        productItem.serialNumber = value;
        this.handleProductItems(qtyCounter, productItem, this.orderProducts.orderDetail)
        // clear the field after the insertion.
        this.scannedSerialNo = '';
    }

    drop(event: CdkDragDrop<ProductModel[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            console.log('Transfering array item ---> ', event)
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        console.log('Drop Event ---> ', event)
    }

    handleProductDict(product: ProductModel) {
        const { partNumber } = product;
        if (!this.orderDetailMap[partNumber]) {
            this.orderDetailMap[partNumber] = [];
        }
        this.selectedProductKey = product.partNumber;
        this.orderDetailMap[product.partNumber] = new Array();
        this.orderDetailArray = [...KeysPipe.pipe(this.orderDetailMap)];
        console.log('model...', this.orderDetailArray);
    }

    handleProductItems(qtyCounter, item, orderDetail) {
        const { order, serialNumber, product: { partNumber, id, name, avgPrice } } = item;
        const {
            warehouseCat,
            inventoryCat,
            onInventoryStatusCat,
            itemStatusCat
        } = orderDetail;
        const orderConfig = {
            id: item.id,
            order,
            serialNumber,
            partNumber,
            product: id,
            name: name,
            quantity: qtyCounter + 1,
            price: avgPrice,
            warehouseCat,
            inventoryCat,
            itemStatusCat,
            onInventoryStatusCat
        };
        this.orderDetailMap[partNumber].push(orderConfig);
        this.orderDetailArray = [...KeysPipe.pipe(this.orderDetailMap)];
    }

    switchRadioBtns(event, newValue) {
        this.orderProducts.order.orderDirection = newValue.id;
        this.catalogs$.subscribe(catalogDictionary => {
            this.initCatalogues(catalogDictionary);
        })
    }

    toggleProductKey(key: string) {
        this.selectedProductKey = key;
    }

    validate() {
        let message = '';
        if (message === '') {
            this.showError = false;
            return false;
        } else {
            this.ShowAlert(message, 2);
            return true;
        }
    }

    confirmCompleted() {
        if (this.orderProducts.order.orderState === 'Completed') {
            const confirmtation = confirm('If you save  the order as completed, you can\'t edit it later. Are you sure');
            if (confirmtation) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    save() {
        const haveError = this.validate();
        if (haveError) { return }
        const completedConfimation = this.confirmCompleted();
        if (!completedConfimation) { return }
        const productsArray = [];
        this.orderDetailArray.map(item => {
            item.value.forEach(item => {
                const { id, serialNumber, product, quantity, price } = item;
                const { itemStatusCat, onInventoryStatusCat, inventoryCat, warehouseCat } = this.orderProducts.orderDetail;
                let payload = {
                    id,
                    product,
                    serialNumber,
                    itemStatus: itemStatusCat.id,
                    onInventoryStatus: onInventoryStatusCat.id,
                    inventory: inventoryCat.id,
                    warehouse: warehouseCat.id,
                    quantity: quantity,
                    price,
                    assignedUser: 1
                }
                if (!id) {
                    delete payload.id;
                }
                productsArray.push(payload)
            })
        })
        this.orderProducts.order.orderDate = new Date().toISOString();
        const orderDto = new OrderProductsDto(this.orderProducts.order, productsArray)
        console.log('saving...', orderDto);
        const params = this.activatedRoute.snapshot.params;
        if (params.id) {
            this.orderService.update(orderDto, params.id)
                .subscribe(response => {
                    console.log('saved!', response);
                    this.ShowAlert('Order Saved!', 1);
                })
        } else {
            this.orderService.create(orderDto)
                .subscribe(response => {
                    console.log('saved!', response);
                    this.ShowAlert('order Saved', 1);
                })
        }
        if (completedConfimation && this.orderProducts.order.orderState === 'Completed') {
            this.store.dispatch(new Navigate(['/orders']))
        }
    }

    deleteProduct(item: any) {
        this.orderDetailArray = [...this.orderDetailArray.filter((x) => x.key !== item.key)];
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
    }

    ShowAlert(messageToShow: string, type: number) {
        if (type === 0) {
            this.showError = true;
            this.alertMessage = messageToShow;
            setTimeout(function () {
                this.showError = false;
            }.bind(this), 1500);
        } else if (type === 1) {
            this.showSuccess = true;
            this.alertMessage = messageToShow;
            setTimeout(function () {
                this.showSuccess = false;
            }.bind(this), 1500);
        } // used to keep the error message on the display
        else if (type === 2) {
            this.showError = true;
            this.alertMessage = messageToShow;
        }
        else if (type === 3) {
            this.showSuccess = true;
            this.alertMessage = messageToShow;
        }

    }
}
