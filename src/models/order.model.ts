import { OrderDto, OrderDetailDto, Catalog } from "./order.dto";

export class OrderDetailModel extends OrderDetailDto {
    itemStatusCat: Catalog;
    onInventoryStatusCat: Catalog;
    inventoryCat: Catalog;
    warehouseCat: Catalog;
}

export class OrderProductsModel {
    order: OrderModel;
    orderDetail: OrderDetailModel;
}

export default class OrderModel extends OrderDto {
    checked?: boolean = false;
    constructor(dto: OrderDto) {
        super()
    }
}