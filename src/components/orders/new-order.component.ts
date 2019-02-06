import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderProductsModel, OrderDetailModel } from '../../models/order.model';
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
export class NewOrderComponent implements OnInit, AfterViewInit {

    readonly SCAN_EVENT_PARTNO = "PART_NO";
    readonly SCAN_EVENT_MACADDRESS = "MAC_ADDRESS";
    // used to clear
    scannedSerialNo = '';
    // use to validate part no. value
    scannedPartNo = '';
    // alerts
    showError = false;
    alertMessage: string;
    showSuccess = false;
    showInfo = false;
    showMessage = false;
    productList: any;

    orderTypes: CatalogModel[] = [
        { id: 1, name: 'Buy', orderDirection: 'In', icon: 'input' },
        { id: 2, name: 'Sell', orderDirection: 'Out', icon: 'input' }
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
            orderType: {} as any,
            orderState: this.orderStates[0],
            orderDate: new Date().toLocaleDateString('en-US'),
            ticketNumber: null,
            notes: ''
        },
        orderDetail: {} as any
    };

    selectedProductKey: string;

    // Orders IN
    onScanSubscription = new Subject<any>();
    orderDetailArray: Array<{ key: any, value: any }> = [];
    orderDetailMap: Dictionary<ProductOrderDetailModel[]> = {};

    // Orders OUT
    outOrderDetailArray: Array<{ key: any, value: any }> = [];
    outOrderDetailMap: Dictionary<ProductOrderDetailModel[]> = {};

    availableProductsList: ProductOrderDetailModel[] = [];
    draggedProductList: ProductOrderDetailModel[] = [];

    filterOrderSubTypes = () => {
        this.orderSubTypes =
            [...this.orderSubTypes.filter(x => x.orderDirection == this.orderProducts.order.orderType.orderDirection)]
    }

    initCatalogues = (catalogsConfig: OrderDetailModel = null) => {

        const fillCatalogues = (catalogDictionary) => {

            this.warehouses = catalogDictionary['Warehouses'];
            this.inventories = catalogDictionary['Inventories'];
            this.inventoryStatuses = catalogDictionary['InventoryStatus'];
            this.itemStatuses = catalogDictionary['ItemStatus'];
            this.orderSubTypes = catalogDictionary['OrderSubTypes'];

            if (!catalogsConfig) {
                this.orderProducts.orderDetail = {
                    warehouseCat: this.warehouses[0],
                    inventoryCat: this.inventories[0],
                    onInventoryStatusCat: this.inventoryStatuses[0],
                    itemStatusCat: this.itemStatuses[0]
                }
            } else {
                this.orderProducts.orderDetail = catalogsConfig;
            }
        }

        this.catalogs$.subscribe(catalogDictionary => {
            if (isEmpty(catalogDictionary)) {
                this.store.dispatch(new GetAll())
                    .subscribe(result => {
                        fillCatalogues(result.catalogs);
                    })
            } else {
                fillCatalogues(catalogDictionary);
            }
        });
    }

    constructor(
        private store: Store,
        public productService: ProductService,
        public inventoryItemService: InventoryItemService,
        public orderService: OrderService,
        public activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    this.productService.getList()
                        .subscribe((products) => {
                            this.productList = products
                        });
                }),
                tap(() => {
                    const params = this.activatedRoute.snapshot.params;
                    if (!params.id) {
                        this.filterOrderSubTypes();
                    }
                    this.initCatalogues();
                }),
                tap(() => {
                    // check if its an order update
                    let cataloguesConfig: OrderDetailModel;
                    const params = this.activatedRoute.snapshot.params;
                    if (params.id) {
                        this.orderService.getById(params.id)
                            .subscribe(result => {
                                this.orderProducts.order = result.order;
                                this.draggedProductList = [...result.products] as any;
                                result.products.forEach(item => {
                                    this.handleProductDict(item.product as any);
                                })
                                result.products.forEach(item => {
                                    const qtyCounter = 0;
                                    cataloguesConfig = {
                                        warehouseCat: this.warehouses.find(x => x.id === item.warehouse),
                                        inventoryCat: this.inventories.find(x => x.id === item.inventory),
                                        onInventoryStatusCat: this.inventoryStatuses.find(x => x.id === item.onInventoryStatus),
                                        itemStatusCat: this.itemStatuses.find(x => x.id === item.itemStatus)
                                    }
                                    this.handleProductItems(qtyCounter + 1, item, cataloguesConfig);
                                })
                                // filter order subtypes
                                this.initCatalogues(cataloguesConfig);
                                this.filterOrderSubTypes();
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

                if (this.orderProducts.order.orderType.orderDirection == "Out") {
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
                                        this.showMessage = false;
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

    canSave() {
        // disable save button if is not a draft and show a message
        if (this.orderProducts.order.orderState !== 'Draft') {
            this.ShowAlert('Only view, any change made to this order won\'t be saved', 3);
        }
        return this.orderProducts.order.orderState === 'Draft' && (
            this.orderProducts.order.ticketNumber !== '' && this.orderProducts.order.ticketNumber !== null
        )
    }

    removeitem(productKey: string, serialNumber: string) {
        const item = this.orderDetailArray.find(x => x.key === productKey).value.find(y => y.serialNumber === serialNumber)
        const values = this.orderDetailArray.find(x => x.key === productKey).value
        const index = values.indexOf(item)
        const newValues = values.slice(0, index).concat(values.slice(index + 1))
        this.orderDetailMap[item.partNumber] = [...newValues]
        this.orderDetailArray.find(x => x.key === productKey).value = [...newValues]


    }

    addItem(value: string) {
        // check if the serialNumber already exist
        if (this.orderDetailArray.find(x => x.key === this.selectedProductKey).value.find(y => y.serialNumber === value)) {
            this.ShowAlert('This item already exist on this order', 0);
            return
        }
        if (value === null || value === '') {
            this.ShowAlert('MAC Address can\'t be empty', 0);
            return
        }
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

    drop(event: CdkDragDrop<ProductOrderDetailModel[]>) {

        const itemToMove = event.previousContainer.data[event.previousIndex];
        const alreadyExists = this.draggedProductList.find(item => {
            return item.serialNumber == itemToMove.serialNumber
        });

        if (alreadyExists) {
            this.ShowAlert('Item already exists.', 2);
            return;
        };

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            console.log('Available list ---> ', this.availableProductsList)
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
        console.log('Selected list ---> ', this.draggedProductList)

    }

    handleProductDict(product: ProductModel) {
        const { partNumber } = product;
        if (this.orderProducts.order.orderType.orderDirection === 'Out') {
            if (!this.outOrderDetailMap[partNumber]) {
                this.scannedSerialNo = ''
                this.outOrderDetailMap[partNumber] = [];
            }
            this.selectedProductKey = product.partNumber;
            this.outOrderDetailArray = [...KeysPipe.pipe(this.orderDetailMap)];
            console.log('model...', this.outOrderDetailArray);
        } else {
            if (!this.orderDetailMap[partNumber]) {
                this.scannedSerialNo = ''
                this.orderDetailMap[partNumber] = [];
            }
            this.selectedProductKey = product.partNumber;
            this.orderDetailArray = [...KeysPipe.pipe(this.orderDetailMap)];
            console.log('model...', this.orderDetailArray);
        }
    }

    handleProductItems(qtyCounter, item, orderDetail) {
        const { serialNumber, price, product: { partNumber, id, name, avgPrice, inventoryItem } } = item;
        const {
            warehouseCat,
            inventoryCat,
            onInventoryStatusCat,
            itemStatusCat
        } = orderDetail;
        const orderConfig = {
            id: item.id,
            serialNumber,
            partNumber,
            product: id,
            name: name,
            quantity: qtyCounter + 1,
            price: price ? price : avgPrice,
            inventoryItem,
            warehouseCat,
            inventoryCat,
            itemStatusCat,
            onInventoryStatusCat
        };
        if (this.orderProducts.order.orderType.orderDirection === 'Out') {
            this.outOrderDetailMap[partNumber].push(orderConfig);
            this.outOrderDetailArray = [...KeysPipe.pipe(this.outOrderDetailMap)];
        } else {
            this.orderDetailMap[partNumber].push(orderConfig);
            this.orderDetailArray = [...KeysPipe.pipe(this.orderDetailMap)];
        }
    }

    switchRadioBtns(event, newValue) {
        this.orderProducts.order.orderType.id = newValue.id;
        this.orderProducts.order.orderType.orderDirection = newValue.orderDirection;
        this.initCatalogues(this.orderProducts.orderDetail);
        this.filterOrderSubTypes();
    }

    toggleProductKey(key: string) {
        this.selectedProductKey = key;
        this.scannedPartNo = this.selectedProductKey;
        this.scannedSerialNo = '';
    }

    validate() {
        let message = '';
        const inputDate = new Date(this.orderProducts.order.orderDate)
        const actualDate = new Date()
        if (inputDate > actualDate) {
            message = '-  Invalid date, must be today or before';
        }

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

    save(ev: Event) {

        ev.preventDefault();
        const haveError = this.validate();
        if (haveError) { return }
        const completedConfimation = this.confirmCompleted();
        if (!completedConfimation) { return }
        const productsArray = [];
        const params = this.activatedRoute.snapshot.params;
        const itemMapper = (item) => {
            item.value.forEach(item => {
                const { serialNumber, product, quantity, price } = item;
                const { itemStatusCat, onInventoryStatusCat, inventoryCat, warehouseCat } = this.orderProducts.orderDetail;
                let payload = {
                    id: item.product,
                    //order: params.id ? parseInt(params.id) : null,
                    product,
                    serialNumber,
                    inventoryItem: item.id,
                    itemStatus: itemStatusCat.id,
                    onInventoryStatus: onInventoryStatusCat.id,
                    inventory: inventoryCat.id,
                    warehouse: warehouseCat.id,
                    quantity: quantity,
                    price,
                    assignedUser: 1
                }
                productsArray.push(payload)
            })
        }

        // In case of order OUT
        if (this.orderProducts.order.orderType.orderDirection == 'Out') {
            
            this.outOrderDetailMap = {};
            this.outOrderDetailArray = [];
            
            this.draggedProductList.forEach(item => {
                this.handleProductDict(item.product as any)
                this.handleProductItems(
                    1,
                    item,
                    this.orderProducts.orderDetail
                )
            })
            this.outOrderDetailArray.map(itemMapper)
        } else {
            this.orderDetailArray.map(itemMapper)
        }
        
        // Todo: this don't save the date from selected by the user
        this.orderProducts.order.orderDate = new Date(this.orderProducts.order.orderDate).toISOString();
        const orderDto: any = new OrderProductsDto(this.orderProducts.order, productsArray);
        orderDto.order.orderType = this.orderProducts.order.orderType.id;
        if (params.id) {
            this.orderService.update(orderDto, params.id)
                .subscribe(response => {
                    console.log('saved --- ', response);
                    this.ShowAlert('Order Saved!', 1);
                })
        } else {
            this.orderService.create(orderDto)
                .subscribe(response => {
                    console.log('saved order dto ---> ', this.orderProducts);
                    this.ShowAlert('order Saved', 1);
                    setTimeout(() => {
                        this.store.dispatch(new Navigate(['/orders']))
                    }, 2000)
                })
        }
    }

    deleteProduct(item: any) {
        this.orderDetailArray = [...this.orderDetailArray.filter((x) => x.key !== item.key)];
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
    }

    ShowAlert(messageToShow: string, type: number) {
        if (type === 0) {
            this.showError = true;
            this.showMessage = true
            this.alertMessage = messageToShow;
        } else if (type === 1) {
            this.showInfo = true;
            this.showMessage = true
            this.alertMessage = messageToShow;
        } // used to keep the error message on the display
        else if (type === 2) {
            this.showMessage = true;
            this.showError = true;
            this.alertMessage = messageToShow;
        }
        else if (type === 3) {
            this.showMessage = true;
            this.showInfo = true;
            this.alertMessage = messageToShow;
        }
        setTimeout(() => {
            this.showMessage = false;
            this.showError = false
        }, 3500);
    }
}
