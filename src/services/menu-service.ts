import { Injectable } from '@angular/core';
import { MenuItem } from '../components/types';

@Injectable()
export class MenuService {
    items: MenuItem[] = [
        { icon: 'dashboard', label: 'Dashboard', routeUrl: '/dashboard', isActive: true },
        { icon: 'assignment', label: 'Orders', routeUrl: '/orders', isActive: false },
        { icon: 'new', label: 'New Order', routeUrl: '/orders/new', isActive: false, isHidden: true },
        { icon: 'smartphone', label: 'Products', routeUrl: '/products', isActive: false }
    ]
}