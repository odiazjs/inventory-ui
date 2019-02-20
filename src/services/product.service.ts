import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { ProductModel } from '../models/product.model';
import { ProductDto } from 'src/models/product.dto';

@Injectable()
export class ProductService extends ResourceService<ProductDto[]> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<ProductDto[]>>) {
        super(
            httpWrapper,
            urlConfig.getProductsUrl,
            { getAll: productServiceFactory, getById: productServiceFactory }
        )
    }
}

const productServiceFactory = (value: ProductDto[]) => {
    return value.map(item => new ProductModel(item))
}
