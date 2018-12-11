import { CatalogModel } from "./order.dto";
import { ProductModel } from "./product.model";

export class InventoryItemModel {
    id: number;
    product: ProductModel;
    serialNumber: string;
    itemStatus: CatalogModel;
    onInventoryStatus: CatalogModel;
    inventory: CatalogModel;
    warehouse: CatalogModel;
    price: string;
    assignedUser: number;
    notes: string;
    checked?: boolean;
    constructor () { }
}