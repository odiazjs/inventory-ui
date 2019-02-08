import {
    OrderProductsDto,
    OrderDetailDto,
    ORDER_PRODUCTS_INITIAL_STATE
} from 'src/models/order.dto';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Dictionary, CatalogDto } from '../types';
import { isEmpty } from 'lodash';
import { GetAll } from 'src/ngxs/models/catalogState.model';
import { OrderService } from 'src/services/order.service';

@Injectable()
export class OrderDataSource {
    dto: OrderProductsDto = ORDER_PRODUCTS_INITIAL_STATE;
    itemsList: OrderDetailDto[] = [];
    addedItemList: OrderDetailDto[] = [];
    @Select(state => state.catalogs) catalogs$: Observable<Dictionary<CatalogDto[]>>;
    constructor(
        private store: Store,
        private orderService: OrderService
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
    getOrderProducts(id) {
        return this.orderService.getById(id)
            .pipe(
                map(result => {
                    this.dto = new OrderProductsDto(result);
                    this.addedItemList = [...result.products] as any;
                })
            )
    }
}