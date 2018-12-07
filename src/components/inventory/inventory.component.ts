import { Component, OnInit } from '@angular/core';
import { startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { InventoryItemService } from 'src/services/barrel';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.template.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

    modalShown: boolean = false;
    itemsList: ProductModel[] = []

    constructor(private inventoryItemService: InventoryItemService) { }

    ngOnInit(): void {
        Observable.of().pipe(startWith(null), delay(0)).subscribe(() => {
            this.inventoryItemService.getList()
                .subscribe((result: any) => {
                    console.log('inventory item list ----->', result);
                    this.itemsList = [...result]
                })
        })
    }

    showModal() {
        return this.modalShown = !this.modalShown;
    }

    filterItems () {

    }
}
