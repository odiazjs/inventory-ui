import { Injectable } from '@angular/core';
import { ResourceService, serializeCase } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import OrderModel from 'src/models/order.model';
import { OrderProductsDto } from 'src/models/order.dto';

@Injectable()
export class OrderService extends ResourceService<OrderProductsDto> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<OrderProductsDto>>) {
        super(
            httpWrapper,
            urlConfig.getOrdersUrl,
            { 
                getAll: getAllOrdersFactory, 
                getById: getOrderByIdFactory,
                postUpdate: (response) => response,
                postCreate: (response) =>  response
            }
        )
    }
}

const getAllOrdersFactory = (value) => {
    console.info('[OrderService] Serializing - Get All Orders: ', value);
    return value.map(item => {
        if (item.orderType){
            item.orderType = serializeCase(item.orderType) as any
        }
        return new OrderModel(item);
    })
}

const getOrderByIdFactory = (value: any) => {
    console.log('[OrderService] Serializing - Get Order by Id: ', value);
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
    return new OrderProductsDto(result)
}