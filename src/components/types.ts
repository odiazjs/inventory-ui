export interface MenuItem {
    icon: string;
    label: string;
    routeUrl: string;
    isActive: boolean;
    isHidden?: boolean;
}

export interface Dictionary<T> {
    [id: string]: T;
}

export class CatalogDto {
    id: number;
    name: string;
    enabled?: boolean;
    code?: string;
    orderDirection?: string;
    markAs?: string;
}

export class CatalogModel extends CatalogDto {
    icon?: string;
}

