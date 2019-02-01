import { Injectable } from '@angular/core';
import { MenuItem } from '../components/types';

@Injectable()
export class MenuService {
    items: MenuItem[] = [
        { icon: 'login', label: 'Login', routeUrl: '/login', isActive: false, isHidden: true },
        { icon: 'track_changes', label: 'Dashboard', routeUrl: '/dashboard', isActive: true },
        { icon: 'swap_horizontal_circle', label: 'Orders', routeUrl: '/orders', isActive: false },
        { icon: 'new', label: 'New Order', routeUrl: '/orders/new', isActive: false, isHidden: true },
        { icon: 'adjust', label: 'Products', routeUrl: '/products', isActive: false },
        { icon: 'screen_rotation', label: 'Inventory', routeUrl: '/inventory', isActive: false }
    ]
}