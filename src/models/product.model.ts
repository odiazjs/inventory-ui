import { ProductDto } from "./product.dto";
import { OrderDetailModel } from "./order.model";

export class ProductModel {
    id: number;
    name: string;
    masterName: string;
    partNumber: string;
    barcode: string;    
    manufacturer: string;
    productGroup: string;
    checked?: boolean;
    constructor(dto: ProductDto) {
    }
}

export interface ProductOrderDetailModel extends OrderDetailModel {

}