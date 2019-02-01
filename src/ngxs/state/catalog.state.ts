import { StateContext, Action, State } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { CatalogStateModel, GetAll } from "../models/catalogState.model";
import { CatalogsService } from "src/services/barrel";
import { forkJoin } from "rxjs";
import { Dictionary } from "src/components/types";
import { CatalogDto } from "src/models/order.dto";

@State<CatalogStateModel>({
    name: 'catalogs'
})
export class CatalogState {

    constructor(
        private router: Router,
        private catalogueService: CatalogsService) { }

    @Action(GetAll)
    getAll({ patchState }: StateContext<Dictionary<CatalogDto[]>>) {
        const getWarehouses$ = this.catalogueService.getWareHouses();
        const getInventories$ = this.catalogueService.getInventories();
        const getInventoryStatus$ = this.catalogueService.getInventoryStatus();
        const getItemStatus$ = this.catalogueService.getItemStatus();
        const getOrderSubTypes$ = this.catalogueService.getOrderSubTypes();

        const getAllCatalogues$ = forkJoin([
            getWarehouses$, 
            getInventories$, 
            getInventoryStatus$, 
            getItemStatus$,
            getOrderSubTypes$
        ])
            .pipe(
                tap(result => {
                    const catalogDictionary: Dictionary<CatalogDto[]> = {};
                    catalogDictionary['Warehouses'] = result[0];
                    catalogDictionary['Inventories'] = result[1];
                    catalogDictionary['InventoryStatus'] = result[2];
                    catalogDictionary['ItemStatus'] = result[3];
                    catalogDictionary['OrderSubTypes'] = result[4];
                    patchState(catalogDictionary);
                })
            )

        return getAllCatalogues$;
    }

}