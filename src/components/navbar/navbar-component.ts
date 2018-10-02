import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/barrel';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.template.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    
    title: string;
    
    @Select(state => state.router)
    routeState$: Observable<any>;
    
    constructor(private menuService: MenuService) { }
    ngOnInit(): void {
        this.routeState$.subscribe(routerState => {
            if (routerState.state) {
                const parseUrl = (url) => {
                    return url.substring(0, url.lastIndexOf('/'))
                }
                let stateUrl = routerState.state.url;
                // const parseUrlResult = parseUrl(stateUrl);
                // if ( parseUrlResult && parseUrlResult !== -1 ) {
                //     stateUrl = parseUrlResult;
                // }
                this.title = this.menuService.items.filter(item => item.routeUrl === stateUrl).pop().label; 
            }
        })
    }
}