import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { MenuItem } from '../types';
import { MenuService } from '../../services/menu-service';
import { parseUrl } from 'src/common/url';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.template.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    menu: MenuItem[] = this.menuService.items;

    @Select(state => state.router)
    routeState$: Observable<any>;

    constructor(private store: Store, private menuService: MenuService) { }
    ngOnInit(): void {
        this.routeState$.subscribe(routerState => {
            if (routerState.state) {
                this.menu.map(item => item.isActive = false);
                let stateUrl = parseUrl(routerState.state.url);
                this.menu.filter(item => item.routeUrl == stateUrl).pop().isActive = true;
            }
        });
    }

    setActive (item: MenuItem) {
        const selectedMenuItem = this.menu.filter(x => x.isActive).pop();
        this.menu.forEach(menuItem => {
            menuItem.isActive = false;
            if (menuItem.label == item.label){
                item.isActive = true;
            }
        })
        this.store.dispatch(new Navigate([item.routeUrl]))
    }
}