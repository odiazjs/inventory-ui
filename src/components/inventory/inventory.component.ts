import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { startWith, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.template.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

    modalShown: boolean = false;
    productsList: ProductModel[] = []

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        Observable.of().pipe(startWith(null), delay(0)).subscribe(() => {
            this.productService.getList()
                .subscribe((result: any) => {
                    this.productsList = [...result]
                })
        })
    }

    showModal() {
        return this.modalShown = !this.modalShown;
    }

    newOrder() {
        
    }
}
