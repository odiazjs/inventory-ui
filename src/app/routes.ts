import { Routes } from '@angular/router';

import {
    DashboardComponent,
    OrdersComponent,
    NewOrderComponent,
    ProductsComponent,
    InventoryComponent
} from '../components/barrel';

export const appRoutes: Routes = [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/new', component: NewOrderComponent },
    { path: 'orders/:id', component: NewOrderComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'inventory', component: InventoryComponent },
];