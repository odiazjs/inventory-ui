import { Injectable } from "@angular/core";
import { Observable, pipe } from "rxjs";
import { startWith, delay, map } from "rxjs/operators";
import ProductDto from "../models/product.dto";

@Injectable()
export class ProductMockService {
    getList<T>(): Observable<any[]> {
        const productList: ProductDto[] = [
            {
                id: 1,
                barcode: '000000111',
                serialNumber: '12345',
                name: 'Polycom DeskPhone 700',
                createdDate: new Date(),
                totalItems: 500,
                avgPrice: 70,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 70,
                maxPrice: 110,
                minPrice: 60
            },
            {
                id: 2,
                barcode: '000000112',
                serialNumber: '123456',
                name: 'Polycom DeskPhone 800',
                createdDate: new Date(),
                totalItems: 250,
                avgPrice: 50,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 50,
                maxPrice: 60,
                minPrice: 50
            },
            {
                id: 3,
                barcode: '000000113',
                serialNumber: '1234567',
                name: 'Polycom DeskPhone 900',
                createdDate: new Date(),
                totalItems: 125,
                avgPrice: 40,
                inputs: 2,
                outputs: 1,
                lastRecordedPrice: 40,
                maxPrice: 75,
                minPrice: 40
            }
        ];
        return Observable.of()
            .pipe(
                startWith(null),
                delay(1000),
                map(() => {
                    return productList;
                })
            )
    }
}
