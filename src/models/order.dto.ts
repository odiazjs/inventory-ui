import { ProductDto } from "./product.dto";
import { isEmpty } from "lodash";
import { CatalogDto } from "src/components/types";

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
    orderType: OrderType | number;
    orderDate: any;
    createdBy: number;
    orderState: string;
    ticketNumber: string;
    notes: string;
    constructor(dto) {
        return Object.assign({}, dto)
    }
}

export class OrderDetailDto {
    id?: number;
    order?: number;
    product: ProductDto | number;
    itemStatus: CatalogDto | number;
    onInventoryStatus: CatalogDto | number;
    inventory: CatalogDto | number;
    warehouse: CatalogDto | number;
    price: string;
    assignedUser: number;
    serialNumber: string;
    inventoryItem?: number;
}

export class OrderProductsDto {
    order: OrderDto;
    products: OrderDetailDto[];
    constructor(response) {
        return Object.assign(this, response)
    }
}

export const DEFAULT_CATALOG_VALUE = {
    id: 1,
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

export const ORDER_DETAIL_CATALOGS_DEFAULT = {
    itemStatus: DEFAULT_CATALOG_VALUE,
    onInventoryStatus: DEFAULT_CATALOG_VALUE,
    inventory: DEFAULT_CATALOG_VALUE,
    warehouse: DEFAULT_CATALOG_VALUE
}

export const ORDER_INITIAL_STATE = (catalogs?) => {
    return Object.assign({}, {
        id: null,
        orderNumber: null,
        orderType: !isEmpty(catalogs) ? catalogs['orderSubTypes'][0] : DEFAULT_CATALOG_VALUE,
        orderDate: new Date().toLocaleDateString('en-US'),
        createdBy: null,
        orderState: DEFAULT_ORDER_STATES[0],
        ticketNumber: null,
        notes: null
    })
}

export const ORDER_DETAIL_INITIAL_STATE = (catalogs?) => {
    return Object.assign({}, {
        id: null,
        order: null,
        product: null,
        itemStatus: !isEmpty(catalogs) ? catalogs['itemStatuses'][0] : DEFAULT_CATALOG_VALUE,
        onInventoryStatus: !isEmpty(catalogs) ? catalogs['inventoryStatuses'][0] : DEFAULT_CATALOG_VALUE,
        inventory: !isEmpty(catalogs) ? catalogs['inventories'][0] : DEFAULT_CATALOG_VALUE,
        warehouse: !isEmpty(catalogs) ? catalogs['warehouses'][0] : DEFAULT_CATALOG_VALUE,
        price: null,
        assignedUser: null,
        serialNumber: null,
        inventoryItem: null
    })
}

export const ORDER_PRODUCTS_INITIAL_STATE: OrderProductsDto = {
    order: Object.assign({}, ORDER_INITIAL_STATE()),
    products: []
}