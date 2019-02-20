import { Injectable } from '@angular/core';
import { ResourceService, serializeCase, deserializeCase ,QueryOptions } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { InventoryItemDto } from '../models/inventoryItem.dto'
import { InventoryItemModel } from '../models/inventoryItem.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class InventoryItemHistoryService extends ResourceService<InventoryItemDto[]>{

  constructor(httpWrapper: HttpWrapper<HttpResponse<InventoryItemDto[]>>) {
    super(
        httpWrapper,
        urlConfig.getInventoryitemsHistory,
        inventoryItemFactory
    )
  }
  getList(paramsObject: any): Observable<InventoryItemDto[]> {
    const queryUrl = `${this.baseUrl}${paramsObject}`;
    return this.httpClient
      .get(`${queryUrl}`)
      .pipe(
        map((list: any[]) => {
            return list['results'].map(serializeCase)
          })
      );
    }
}

const inventoryItemFactory: any = (value: InventoryItemModel[]) => {
  return value.map(item => new InventoryItemModel())
}
