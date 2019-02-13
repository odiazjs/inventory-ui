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
    constructor(dto) {
        return Object.assign({}, dto)
    }
}

export interface ProductOrderDetailModel extends OrderDetailModel {

}