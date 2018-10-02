import { Routes } from '@angular/router';

import {
    DashboardComponent,
    OrdersComponent,
    NewOrderComponent,
    ProductsComponent
} from '../components/barrel';

export const appRoutes: Routes = [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/new', component: NewOrderComponent },
    { path: 'products', component: ProductsComponent },
];