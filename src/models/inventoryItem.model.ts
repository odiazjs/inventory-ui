import { ProductModel } from "./product.model";
import { CatalogModel } from "src/components/types";

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