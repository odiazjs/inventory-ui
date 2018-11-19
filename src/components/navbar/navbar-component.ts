import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/barrel';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { parseUrl } from 'src/common/url';

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
                const stateUrl = parseUrl(routerState.state.url);
                this.title = this.menuService.items.filter(item => item.routeUrl === stateUrl).pop().label;
            }
        });
    }
}
