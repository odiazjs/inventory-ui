import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CatalogModel, CatalogDto } from 'src/components/types';

declare var require: any;

@Injectable()
export class CatalogsService extends ResourceService <CatalogModel[]> {
  constructor(httpWrapper: HttpWrapper<HttpResponse<CatalogModel[]>>) { 
    super(
      httpWrapper,
      '',
      { getAll: catalogServiceFactory, getById: catalogServiceFactory }
    )
  }
  toCamelCase = require('to-camel-case');
  serializeCase = (obj) => {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {};
    while (n--) {
      key = keys[n];
      newobj[this.toCamelCase(key)] = obj[key];
    }
    return newobj;
  }
  
  getWareHouses(){
    this.baseUrl = urlConfig.getCatalogWarehousesUrl;
    return this.getList();
  }

  getInventories(){
    this.baseUrl = urlConfig.getCatalogInventoriesUrl;
    return this.getList();
  }

  getInventoryStatus(){
    this.baseUrl = urlConfig.getCatalogOnInventoryStatusUrl;
    return this.getList();
  }

  getItemStatus(){
    this.baseUrl = urlConfig.getCatalogAllItemStatusUrl;
    return this.getList();
  }

  getManufacturers(){
    this.baseUrl = urlConfig.getCatalogManufacturers;
    return this.getList();
  }

  getProductsGroups(){
    this.baseUrl = urlConfig.getCatalogProductsGroup;
    return this.getList();
  }

  getOrderSubTypes () {
    this.baseUrl = urlConfig.getCatalogOrderSubTypes;
    return this.getList();
  }

  getList(paramsObject: any = {}): Observable<CatalogDto[]> {
  return this.httpClient
    .get(`${this.baseUrl}`)
    .pipe(
      map((list: { results: any[] }) => {
        return list.results.map(this.serializeCase)
      })
    );
  }

}


const catalogServiceFactory = (value: CatalogModel[]) => {
  console.log('catlog item', value)
  return value.map(item => new CatalogModel())
}