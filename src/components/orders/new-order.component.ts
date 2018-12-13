import { Component, OnInit } from '@angular/core';
import { OrderProductsModel } from '../../models/order.model';
import { ProductOrderDetailModel, ProductModel } from '../../models/product.model';
import { Subject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, startWith, delay, tap } from 'rxjs/operators';
import { CatalogModel, OrderProductsDto, CatalogDto } from '../../models/order.dto';
import { ProductService, OrderService } from 'src/services/barrel';
import { Dictionary } from 'src/components/types';
import { KeysPipe } from 'src/common/keys.pipe';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'lodash';
import { Store, Select } from '@ngxs/store';
import { GetAll } from 'src/ngxs/models/catalogState.model';

@Component({
    selector: 'app-new-order',
    templateUrl: './new-order.template.html',
    styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

    readonly SCAN_EVENT_PARTNO = "PART_NO";
    readonly SCAN_EVENT_MACADDRESS = "MAC_ADDRESS";

    orderTypes: CatalogModel[] = [
        { id: 1, name: 'IN', icon: 'input' },
        { id: 2, name: 'OUT', icon: 'input' }
    ];

    orderStates: string[] = [
        'Draft',
        'Completed',
        'Closed',
        'Discarded'
    ];

    @Select(state => state.catalogs) catalogs$: Observable<Dictionary<CatalogDto[]>>;

    warehouses: CatalogModel[] = [];
    inventories: CatalogModel[] = [];
    inventoryStatuses: CatalogModel[] = [];
    itemStatuses: CatalogModel[] = [];

    orderProducts: OrderProductsModel = {
        order: {
            orderNumber: null,
            orderType: this.orderTypes[0].id,
            orderState: this.orderStates[0],
            orderDate: new Date().toLocaleDateString('en-US'),
            ticketNumber: null,
            notes: "some notes."
        },
        orderDetail: {} as any
    };

    selectedProductKey: string;

    onScanSubscription = new Subject<any>();
    orderDetailArray: Array<{ key: any, value: any }> = [];
    orderDetailMap: Dictionary<ProductOrderDetailModel[]> = {};

    constructor(
        private store: Store,
        public productService: ProductService,
        public orderService: OrderService,
        public activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {

        const initCatalogues = (catalogDictionary) => {
            this.warehouses = catalogDictionary['Warehouses'];
            this.inventories = catalogDictionary['Inventories'];
            this.inventoryStatuses = catalogDictionary['InventoryStatus'];
            this.itemStatuses = catalogDictionary['ItemStatus'];
            this.orderProducts.orderDetail = {
                warehouseCat: this.warehouses[0],
                inventoryCat: this.inventories[0],
                onInventoryStatusCat: this.inventoryStatuses[0],
                itemStatusCat: this.itemStatuses[0]
            }
        }

        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => {
                    this.catalogs$.subscribe(catalogDictionary => {
                        if (isEmpty(catalogDictionary)) {
                            this.store.dispatch(new GetAll())
                                .subscribe(result => {
                                    initCatalogues(result.catalogs)
                                })
                        } else {
                            initCatalogues(catalogDictionary);
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
                debounceTime(500),
                distinctUntilChanged(),
                flatMap((eventData) => Observable.of(eventData))
            ).subscribe((eventData) => {
                if (isEmpty(eventData.value.trim())) return;
                const { value, message } = eventData;
                this.productService.getList()
                    .subscribe((products) => {
                        let matches = [];
                        const result: ProductModel[] = products;

                        switch (message) {
                            case this.SCAN_EVENT_PARTNO:
                                matches = result.filter(x => x.partNumber === value);
                                if (matches.length) {
                                    product = [...matches].shift();
                                    this.handleProductDict(product);
                                }
                                break;
                            case this.SCAN_EVENT_MACADDRESS: 4
                                const qtyCounter = 0;
                                matches = result.filter(x => x.partNumber === this.selectedProductKey);
                                const productItem: any = { product: [...matches].shift() };
                                productItem.serialNumber = value;
                                this.handleProductItems(qtyCounter, productItem, this.orderProducts.orderDetail)
                                break;

                        }
                    });
            });

        onScan$.remove(onScan$);
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
        console.log('radio event...', event);
        this.orderProducts.order.orderType = newValue.id;
        console.log('new value...', this.orderProducts.order.orderType);
    }

    toggleProductKey(key: string) {
        this.selectedProductKey = key;
    }

    save() {
        const productsArray = [];
        this.orderDetailArray.map(item => {
            item.value.forEach(item => {
                const { id, serialNumber, product, quantity, price } = item;
                const { itemStatusCat, onInventoryStatusCat, inventoryCat, warehouseCat } = this.orderProducts.orderDetail;
                let payload = {
                    id,
                    order: this.orderProducts.order.id,
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
                })
        } else {
            this.orderService.create(orderDto)
                .subscribe(response => {
                    console.log('saved!', response);
                })
        }
    }

    deleteProduct(item: any) {
        this.orderDetailArray = [...this.orderDetailArray.filter((x) => x.key !== item.key)];
        this.orderDetailMap[item.key] !== undefined ? delete this.orderDetailMap[item.key] : false;
    }
}
