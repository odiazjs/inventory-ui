import ProductDto from "./product.dto";

export class OrderType {
    id: number;
    name: string;
    enabled: boolean;
    order_direction: string;
}

export class CreatedBy {
    id: number;
    email: string;
}

export class OrderDto {
    id?: number;
    orderNumber: string;
    orderType: number;
    orderDate: string;
    createdBy?: CreatedBy;
    orderState: string;
    ticketNumber: string;
    notes?: string;
    createdDate?: string;
}

export class OrderDetailDto {
    id?: number;
    order?: number;
    productId?: number;
    product?: ProductDto;
    itemStatus?: number;
    onInventoryStatus?: number;
    inventory?: number;
    warehouse?: number;
    quantity?: number;
    price?: number;
    assignedUser?: number;
}

export class OrderProductsDto {
    order: OrderDto;
    products: OrderDetailDto[];
    constructor(dto: OrderDto, products: OrderDetailDto[]) {
        this.order = dto;
        this.products = products;
    }
}

export class Catalog {
    id: number;
    name: string;
    enabled?: boolean;
    order_direction?: string;
}

export class CatalogModel extends Catalog {
    icon?: string;
}