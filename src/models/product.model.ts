import { OrderDetailModel } from "./order.model";
import { ProductDto } from "./product.dto";

export class ProductModel extends ProductDto {
    checked?: boolean;
    constructor(dto) {
        super()
        return Object.assign({}, dto)
    }
}

export interface ProductOrderDetailModel extends OrderDetailModel {

}