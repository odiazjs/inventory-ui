export class ProductDto {
    id: number;
    name: string;
    manufacturer: string;
    productGroup: string;
    barcode?: any;
    inputs: number;
    outputs: number;
    totalItems: number;
    createdDate: Date;
    minPrice: string;
    maxPrice: string;
    avgPrice: string;
    lastRecordedPrice: string;
    partNumber: string;
    ean?: any;
}