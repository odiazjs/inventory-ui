import { CatalogDto } from "./order.dto";
import { ProductDto } from "./product.dto";

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

