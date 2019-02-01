import { DashboardComponent, OrdersComponent, NewOrderComponent, ProductsComponent, InventoryComponent } from '../components/barrel';
export var appRoutes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'orders/new', component: NewOrderComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'inventory', component: InventoryComponent },
];
//# sourceMappingURL=routes.js.map