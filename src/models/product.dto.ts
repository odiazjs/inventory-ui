export default class ProductDto {
    id?: number;
    name?: string;
    serialNumber: string;
    barcode?: string;
    partNumber?: string;
    inputs?: number;
    outputs?: number;
    totalItems?: number;
    createdDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    avgPrice?: number;
    lastRecordedPrice?: number;
}