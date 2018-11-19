import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductService extends ResourceService<ProductModel[]> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<ProductModel[]>>) {
        super(
            httpWrapper,
            urlConfig.getProductsUrl,
            productServiceFactory
        )
    }
}

const productServiceFactory = (value: ProductModel[]) => {
    console.log('serializer', value)
    return value.map(item => new ProductModel(item))
}