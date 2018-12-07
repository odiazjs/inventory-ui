export class InventoryItemModel {
    id: number;
    product: number;
    serialNumber: string;
    itemStatus: number;
    onInventoryStatus: number;
    inventory: number;
    warehouse: number;
    price: string;
    assignedUser: number;
    notes: string;
    constructor () {
        
    }
}