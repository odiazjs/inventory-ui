import { Component, OnInit } from '@angular/core';
import { startWith, delay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InventoryItemService, InventoryItemFilterService, InventoryItemHistoryService } from 'src/services/barrel';
import { InventoryItemModel } from 'src/models/inventoryItem.model';
import { Dictionary } from '../types';
import { CatalogDto, CatalogModel } from 'src/models/order.dto';
import { Select, Store } from '@ngxs/store';
import { GetAll } from 'src/ngxs/models/catalogState.model';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.template.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

    modalShown: boolean = false;
    historyShow = false;
    historyItemName: string;
    historyItemSerialNo: string;
    itemHistory: InventoryItemModel[] = [];
    itemsList: InventoryItemModel[] = [];
    selectedItems: InventoryItemModel[] = [];

    @Select(state => state.catalogs) catalogs$: Observable<Dictionary<CatalogDto[]>>;

    warehouses: CatalogModel[] = [];
    inventories: CatalogModel[] = [];
    inventoryStatuses: CatalogModel[] = [];
    itemStatuses: CatalogModel[] = [];

    filterValues: any = {};
    configValues: {
        warehouseCat: CatalogModel,
        inventoryCat: CatalogModel,
        onInventoryStatusCat: CatalogModel,
        itemStatusCat: CatalogModel
    } = {} as any;

    constructor(
        private store: Store,
        private inventoryItemService: InventoryItemService,
        private inventoryITemFilterService: InventoryItemFilterService,
        private inventoryitemHistoryService: InventoryItemHistoryService  ) { }

    ngOnInit(): void {
        Observable.of()
            .pipe(
                startWith(null),
                delay(0),
                tap(() => { this.store.dispatch(new GetAll()) }),
                tap(() => {
                    this.catalogs$.subscribe(catalogDictionary => {
                        this.warehouses = catalogDictionary['Warehouses'];
                        this.inventories = catalogDictionary['Inventories'];
                        this.inventoryStatuses = catalogDictionary['InventoryStatus'];
                        this.itemStatuses = catalogDictionary['ItemStatus'];
                        this.filterValues = {
                            warehouseCat: this.warehouses[0],
                            inventoryCat: this.inventories[0],
                            onInventoryStatusCat: this.inventoryStatuses[0],
                            itemStatusCat: this.itemStatuses[0]
                        }
                        // this.configValues = Object.assign({}, this.filterValues);
                    })
                }),
                tap(() => {
                    this.getList();
                }),
            ).subscribe()
    }

    getList() {
        this.inventoryItemService.getList()
            .subscribe((result: any) => {
                this.itemsList = [...result]
            })
    }

    toggleCheck(item: InventoryItemModel) {
        item.checked = !item.checked;
    }


    showModal() {
        this.selectedItems = this.itemsList.filter(x => x.checked);
        console.log(this.selectedItems[0].onInventoryStatus)
        this.configValues = {
            warehouseCat: this.warehouses.find(x => x.id === this.selectedItems[this.selectedItems.length - 1].warehouse.id),
            onInventoryStatusCat: this.inventoryStatuses.find(x => x.id === this.selectedItems[this.selectedItems.length - 1]
                                .onInventoryStatus.id),
            inventoryCat: this.inventories.find(x => x.id === this.selectedItems[this.selectedItems.length - 1].inventory.id),
            itemStatusCat: this.itemStatuses.find(x => x.id === this.selectedItems[this.selectedItems.length - 1].itemStatus.id)
        }
        return this.modalShown = !this.modalShown;
    }

    showHistory(id: string) {
        const itemSelected = this.itemsList.filter( x => x.id === Number(id))
        this.inventoryitemHistoryService.getList(id).subscribe( (result: any) => {
            this.itemHistory = [...result];
            this.itemHistory.push(itemSelected[0])
        }, (error) => {
            this.itemHistory.push(itemSelected[0]);
        })
        this.historyItemName = itemSelected[0].product.name;
        this.historyItemSerialNo = itemSelected[0].serialNumber;
        this.historyShow = !this.historyShow;
    }

    filterItems() {
        const dto = {
            itemStatusId: this.filterValues.itemStatusCat.id,
            onInventoryStatusId: this.filterValues.onInventoryStatusCat.id,
            inventoryId: this.filterValues.inventoryCat.id,
            warehouseId: this.filterValues.warehouseCat.id,
        }
        this.inventoryITemFilterService.getList(dto)
        .subscribe( (result: any) => {
            this.itemsList = [...result]
        });

    }

    removeFilter(){
        this.getList();
    }

    update() {
        const dto = this.selectedItems.map(item => {
            return {
                id: item.id,
                product: item.product.id,
                serialNumber: item.serialNumber,
                itemStatus: this.configValues.itemStatusCat.id,
                onInventoryStatus: this.configValues.onInventoryStatusCat.id,
                inventory: this.configValues.inventoryCat.id,
                warehouse: this.configValues.warehouseCat.id,
                price: item.price,
                assignedUser: item.assignedUser,
                notes: item.notes
            }
        })
        this.inventoryItemService.update(dto)
            .subscribe(result => {
                this.getList();
                this.showModal();
            })
    }
}
