import { ProductDto } from "./product.dto";

export interface OrderType {
    id: number;
    name: string;
    enabled: boolean;
    orderDirection: string;
}

export class CreatedBy {
    id: number;
    email: string;
}

export class OrderDto {
    id: number;
    orderNumber: string;
    orderType: OrderType;
    orderDate: string;
    createdBy: number;
    orderState: string;
    ticketNumber: string;
    notes: string;
    constructor(dto) {
        return Object.assign({}, dto)
    }
}

export class OrderDetailDto {
    id: number;
    order: number;
    product: ProductDto;
    itemStatus: number;
    onInventoryStatus: number;
    inventory: number;
    warehouse: number;
    price: string;
    assignedUser: number;
    serialNumber: string;
    inventoryItem: number;
}

export class OrderProductsDto {
    order: OrderDto;
    products: OrderDetailDto[];
    constructor(response) {
        return Object.assign(this, response)
    }
}

export const DEFAULT_CATALOG_VALUE = {
    id: null,
    name: null,
    enabled: null,
    orderDirection: null
}

export const DEFAULT_ORDER_STATES = [
    'Draft',
    'Completed',
    'Discarded'
];

export const DEFAULT_ORDER_TYPES = [
    { id: 1, name: 'Buy', orderDirection: 'In', icon: 'input' },
    { id: 2, name: 'Sell', orderDirection: 'Out', icon: 'input' }
]

export const DEFAULT_ORDER_SUBTYPES = (catalogs) => {
    return catalogs['orderSubTypes'];
}

export const ORDER_INITIAL_STATE = (catalogs?) => {
    return {
        id: null,
        orderNumber: null,
        orderType: catalogs ? catalogs['orderSubTypes'][0] : DEFAULT_CATALOG_VALUE,
        orderDate: new Date().toLocaleDateString('en-US'),
        createdBy: null,
        orderState: null,
        ticketNumber: null,
        notes: null
    }
}

export const ORDER_DETAIL_INITIAL_STATE = (catalogs) => {
    return {
        id: null,
        order: null,
        product: null,
        itemStatus: catalogs['itemStatuses'][0],
        onInventoryStatus: catalogs['inventoryStatuses'][0],
        inventory: catalogs['inventories'][0],
        warehouse: catalogs['warehouses'][0],
        price: null,
        assignedUser: null,
        serialNumber: null,
        inventoryItem: null
    }
}

export const ORDER_PRODUCTS_INITIAL_STATE: OrderProductsDto = {
    order: {
        id: null,
        orderNumber: null,
        orderType: null,
        orderDate: new Date().toLocaleDateString('en-US'),
        createdBy: null,
        orderState: null,
        ticketNumber: null,
        notes: null
    },
    products: []
}