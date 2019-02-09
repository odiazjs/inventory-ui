import { ProductDto } from "./product.dto";
import { CatalogDto } from "src/components/types";

export class InventoryItemDto {
    id: number;
    product: ProductDto;
    serial_number: string;
    item_status: CatalogDto;
    on_inventory_status: CatalogDto;
    inventory: CatalogDto;
    warehouse: CatalogDto;
    available: boolean;
    quantity: number;
    price: string;
    assigned_user: number;
    notes: string;
    created_in: string;
    created_by: number;
    updated_in: string;
    updated_by?: any;
}

export interface InventoryItemModel {
    id: number;
    product: ProductDto;
    serialNumber: string;
    itemStatus: CatalogDto;
    onInventoryStatus: CatalogDto;
    inventory: CatalogDto;
    warehouse: CatalogDto;
    available: boolean;
    quantity: number;
    price: string;
    assignedUser: number;
    notes: string;
    createdIn: string;
    createdBy: number;
    updatedIn: string;
    updatedBy?: any;
}

