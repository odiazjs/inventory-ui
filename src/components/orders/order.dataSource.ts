import {
    OrderProductsDto,
    ORDER_PRODUCTS_INITIAL_STATE,
    OrderDto,
    OrderDetailDto
} from 'src/models/order.dto';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Dictionary, CatalogDto } from '../types';
import { isEmpty } from 'lodash';
import { GetAll } from 'src/ngxs/models/catalogState.model';
import { OrderService } from 'src/services/order.service';
import { InventoryItemFilterService } from 'src/services/inventory-item-filter.service';
import { InventoryItemModel } from 'src/models/inventoryItem.model';

@Injectable()
export class OrderDataSource {
    dto: OrderProductsDto = ORDER_PRODUCTS_INITIAL_STATE;
    @Select(state => state.catalogs) catalogs$: Observable<Dictionary<CatalogDto[]>>;
    constructor(
        private store: Store,
        private orderService: OrderService,
        private inventoryItemService: InventoryItemFilterService
    ) { }
    getOrderCatalogs() {
        const fillCatalogs = (data) => {
            return {
                warehouses : data['Warehouses'],
                inventories : data['Inventories'],
                inventoryStatuses : data['InventoryStatus'],
                itemStatuses : data['ItemStatus'],
                orderSubTypes : data['OrderSubTypes']
            }
        }
        return this.catalogs$.pipe(
            map(catalogDictionary => {
                if (isEmpty(catalogDictionary)) {
                    this.store.dispatch(new GetAll())
                        .pipe(map (result => {
                            return fillCatalogs(result.data)
                        }))
                } else {
                    return fillCatalogs(catalogDictionary)
                }
            })
        )
    }
    getOrderById(id) {
        return this.orderService.getById(id)
            .pipe(
                map(result => {
                    this.dto = Object.assign({}, result);
                    return new OrderProductsDto(result);
                })
            )
    }

    getInventoryItems (partNo: string) {
        return this.inventoryItemService.getList({part_number: partNo});
    }

    saveOrder (
        order: OrderDto, 
        orderDetail: OrderDetailDto,
        inventoryItems: InventoryItemModel[]
    ) {
        let payload: OrderProductsDto = {
            order,
            products: inventoryItems.map<OrderDetailDto>((item) => {
                return {
                    product: item.product['id'],
                    itemStatus: orderDetail.itemStatus['id'],
                    onInventoryStatus: orderDetail.onInventoryStatus['id'],
                    inventory: orderDetail.inventory['id'],
                    warehouse: orderDetail.warehouse['id'],
                    price: item.price,
                    assignedUser: item.assignedUser,
                    serialNumber: item.serialNumber,
                    inventoryItem: item.id
                }
            })
        }
        payload.order.orderType = order.orderType['id'];
        payload.order.orderDate = new Date();

        return this.orderService.create(payload)
    }

    updateOrder (id: string, order: OrderDto, orderDetail: OrderDetailDto, orderDetailList: OrderDetailDto[]) {
        let payload: OrderProductsDto = {
            order,
            products: orderDetailList.map<OrderDetailDto>((item, index) => {
                if (!item.inventoryItem) {
                    return {
                        order: parseInt(id),
                        product: item.product['id'],
                        itemStatus: orderDetail.itemStatus['id'],
                        onInventoryStatus: orderDetail.onInventoryStatus['id'],
                        inventory: orderDetail.inventory['id'],
                        warehouse: orderDetail.warehouse['id'],
                        price: item.price,
                        assignedUser: item.assignedUser,
                        serialNumber: item.serialNumber,
                        inventoryItem: item.id
                    }
                } else {
                    item.product = item.product['id']
                    return item
                }
            })
        }
        payload.order.orderType = order.orderType['id'];
        payload.order.orderDate = new Date(); 
        return this.orderService.update(payload, id)
    }
}