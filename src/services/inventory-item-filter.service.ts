import { Injectable } from '@angular/core';
import { ResourceService, serializeCase, deserializeCase ,QueryOptions } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { InventoryItemModel } from '../models/inventoryItem.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InventoryItemFilterService extends ResourceService<InventoryItemModel[]> {


    constructor(httpWrapper: HttpWrapper<HttpResponse<InventoryItemModel[]>>) {
        super(
            httpWrapper,
            urlConfig.getFilteredItemsUrl,
            inventoryItemFactory
        )
    }
    getList(paramsObject: any): Observable<InventoryItemModel[]> {
        const serializedSnakeCase =  deserializeCase(paramsObject);
        const paramsQueryString = QueryOptions.toQueryString(serializedSnakeCase);
        const queryUrl = `${this.baseUrl}${paramsQueryString}`;
        return this.httpClient
          .get(`${queryUrl}`)
          .pipe(
            map((list: any[]) => {
                return list['results'] ? list['results'].map(serializeCase) : []
              })
          );
        }
}

const inventoryItemFactory: any = (value: InventoryItemModel[]) => {
    console.log('serializer', value)
    return value.map(item => new InventoryItemModel())
}