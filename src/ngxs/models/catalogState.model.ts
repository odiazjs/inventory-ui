import { CatalogDto } from "src/models/order.dto";

export const CATALOG_GETALL_STATE = 'Catalog_GetAll'

export class CatalogStateModel extends CatalogDto {
    constructor (dto: CatalogDto) {
        super();
        this.id = dto.id;
        this.name = dto.name;
        this.enabled = dto.enabled;
    }
    icon?: string;
}

export class GetAll {
    static readonly type = CATALOG_GETALL_STATE;
    constructor() {}
}