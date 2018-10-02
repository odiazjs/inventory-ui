export interface MenuItem {
    icon: string;
    label: string;
    routeUrl: string;
    isActive: boolean;
    isHidden?: boolean;
}