import { StateContext, Action, State } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { CatalogStateModel, GetAll } from "../models/catalogState.model";
import { CatalogsService } from "src/services/barrel";
import { forkJoin } from "rxjs";
import { Dictionary, CatalogDto } from "src/components/types";

@State<CatalogStateModel>({
    name: 'catalogs'
})
export class CatalogState {

    constructor(
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