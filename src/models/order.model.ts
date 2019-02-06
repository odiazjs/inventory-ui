import { OrderDto, OrderDetailDto, CatalogDto } from "./order.dto";

export class OrderDetailModel extends OrderDetailDto {
    itemStatusCat: CatalogDto;
    onInventoryStatusCat: CatalogDto;
    inventoryCat: CatalogDto;
    warehouseCat: CatalogDto;
}

export class OrderProductsModel {
    order: OrderModel;
    orderDetail: OrderDetailModel;
}

export default class OrderModel extends OrderDto {
    checked?: boolean = false;
    constructor(dto: OrderDto) {
        super(dto)
    }
}