import { ProductDto } from "./product.dto";

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
    orderType: CatalogDto;
    orderDate: string;
    createdBy?: CreatedBy;
    orderState: string;
    ticketNumber: string;
    notes?: string;
    createdDate?: string;
    constructor (dto) {
        return Object.assign({}, dto)
    }
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
    orderSubtype?: number;
    quantity?: number;
    price?: number;
    assignedUser?: number;
    serialNumber?: number;
    inventoryItem?: number;
}

export class OrderProductsDto {
    order: OrderDto;
    products: OrderDetailDto[];
    constructor(dto: OrderDto, products?: OrderDetailDto[]) {
        this.order = dto;
        this.products = products;
    }
}

export class CatalogDto {
    id: number;
    name: string;
    enabled?: boolean;
    code?: string;
    orderDirection?: string;
    order_direction?: string;
}

export class CatalogModel extends CatalogDto {
    icon?: string;
    orderDirection?: string;
}