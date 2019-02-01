import { Injectable } from '@angular/core';
import { ResourceService, serializeCase } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { InventoryItemDto } from '../models/inventoryItem.dto'
import { InventoryItemModel } from '../models/inventoryItem.model'

@Injectable()
export class InventoryItemService extends ResourceService<InventoryItemDto[]> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<InventoryItemDto[]>>) {
        super(
            httpWrapper,
            urlConfig.getAllItemsUrl,
            inventoryItemFactory
        )
    }
}

const inventoryItemFactory: any = (value: InventoryItemModel[]) => {
    console.log('serializer', value)
    let outterMap: any[] = value.map(item => serializeCase(item))
    outterMap.forEach(item => { item.product = serializeCase(item.product) })
    return outterMap;
}