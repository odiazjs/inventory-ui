import { Injectable } from '@angular/core';
import { ResourceService, serializeCase } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { OrderProductsDto } from 'src/models/order.dto';
import OrderModel from 'src/models/order.model';

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

const orderServiceFactory = (value: any) => {
    console.log('serializer', value);
    if (Array.isArray(value)){
        return value.map(item => {
            if (item.orderType){
                item.orderType = serializeCase(item.orderType) as any
            }
            return new OrderModel(item);
        })
    } else {
        const result = {
            order: serializeCase(value.order) as any,
            products: value.products.map(item => {
                if (item.product) {
                    item.product = serializeCase(item.product) as any
                }
                return serializeCase(item) as any
            })
        }
        if (result.order.orderType){
            result.order.orderType = serializeCase(result.order.orderType) as any
        }
        return new OrderProductsDto(result.order, result.products)
    }
}