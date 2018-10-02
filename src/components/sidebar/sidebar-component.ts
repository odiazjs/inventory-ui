import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { MenuItem } from '../types';
import { MenuService } from '../../services/menu-service';

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
                const parseUrl = (url) => {
                    return url.substring(0, url.lastIndexOf('/'))
                }
                this.menu.map(item => item.isActive = false);
                let stateUrl = routerState.state.url;
                // let parseUrlResult = parseUrl(stateUrl);
                // if ( parseUrlResult && parseUrlResult !== -1 ) {
                //     stateUrl = parseUrlResult;
                // }
                this.menu.filter(item => item.routeUrl == stateUrl).pop().isActive = true;
            }
        });
    }

    setActive (item: MenuItem) {
        const selectedMenuItem = this.menu.filter(x => x.isActive).pop();
        if (item.label == selectedMenuItem.label) {
            return;
        }
        this.menu.forEach(menuItem => {
            menuItem.isActive = false;
            if (menuItem.label == item.label){
                item.isActive = true;
            }
        })
        this.store.dispatch(new Navigate([item.routeUrl]))
    }
}