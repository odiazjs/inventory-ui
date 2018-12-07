import { Routes } from '@angular/router';

import {
    DashboardComponent,
    OrdersComponent,
    NewOrderComponent,
    ProductsComponent,
    InventoryComponent,
    LoginComponent
} from '../components/barrel';

export const appRoutes: Routes = [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/new', component: NewOrderComponent },
    { path: 'orders/:id', component: NewOrderComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'inventory', component: InventoryComponent },
];