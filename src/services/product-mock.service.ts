import { Injectable } from "@angular/core";
import { Observable, pipe } from "rxjs";
import { startWith, delay, map } from "rxjs/operators";
import { ProductDto } from "../models/product.dto";

@Injectable()
export class ProductMockService {
    getList<T>(): Observable<any[]> {
        const productList: any[] = [
            {
                "id": 1,
                "name": "Cisco Expansion for 8851/8861",
                "master_name": "",
                "part_number": "CP-BEKEM-3PCC=",
                "manufacturer": "Cisco",
                "product_group": "IP Phones"
            },
            {
                "id": 2,
                "name": "Cisco Expansion for 8851/8861",
                "master_name": "",
                "part_number": "CP-BEKEM-3PCC=",
                "manufacturer": "Cisco",
                "product_group": "IP Phones"
            },
            {
                "id": 3,
                "name": "Cisco Expansion for 8851/8861",
                "master_name": "",
                "part_number": "CP-BEKEM-3PCC=",
                "manufacturer": "Cisco",
                "product_group": "IP Phones"
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
