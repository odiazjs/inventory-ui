import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { OrderDetailModel } from '../models/order.model';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { OrderDto, OrderProductsDto } from 'src/models/order.dto';

declare var require;
const toCamelCase = require('to-camel-case');
const toSnakeCase = require('to-snake-case');

const SERIALIZE_CASE = 'SERIALIZE';
const DESERIALIZE_CASE = 'DESERIALIZE';

const serializeCase = (obj) => {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {};
    while (n--) {
        key = keys[n];
        newobj[toCamelCase(key)] = obj[key];
    }
    return newobj;
}

const deserializeCase = (obj) => {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {};
    while (n--) {
        key = keys[n];
        newobj[toSnakeCase(key)] = obj[key];
    }
    return newobj;
}

@Injectable()
export class OrderService extends ResourceService<OrderProductsDto> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<OrderProductsDto>>) {
        super(
            httpWrapper,
            urlConfig.getOrdersUrl,
            orderServiceFactory
        )
    }
}

const orderServiceFactory = (value: { order: OrderDto, products: OrderDetailModel[] }, serializeDirection: string) => {
    console.log('serializer', value);
    const result: any = {
        order: serializeDirection === SERIALIZE_CASE ? serializeCase(value.order) : deserializeCase(value.order),
        products: value.products.map((item) => {
            const serializedItem: any = serializeDirection === SERIALIZE_CASE ? serializeCase(item) : deserializeCase(item);
            if ( typeof serializedItem.product == 'object') {
                serializedItem.product = Object.assign({} as any, serializeCase(item.product))
            }
            return serializedItem;
        })
    }
    return new OrderProductsDto(result.order, result.products);
}