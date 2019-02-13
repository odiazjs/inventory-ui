import { OrderDto, OrderDetailDto, OrderProductsDto } from "./order.dto";
import { CatalogDto } from "src/components/types";

export class OrderDetailModel extends OrderDetailDto {
    itemStatusCat: CatalogDto;
    onInventoryStatusCat: CatalogDto;
    inventoryCat: CatalogDto;
    warehouseCat: CatalogDto;
}

export class OrderProductsModel extends OrderProductsDto {
    order: OrderModel;
    orderDetail: OrderDetailModel;
}

export default class OrderModel extends OrderDto {
    checked?: boolean = false;
    constructor(dto: OrderDto) {
        super(dto)
    }
}