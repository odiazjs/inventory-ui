import ProductDto from "./product.dto";
import { OrderDetailModel } from "./order.model";

export class ProductModel extends ProductDto {
    constructor (dto: ProductDto) {
        super()    
    }
}

export interface ProductOrderDetailModel extends ProductModel, OrderDetailModel {

}