import { Component, OnInit } from '@angular/core';
import { MenuService, AuthService, ParsedJwtInfo } from '../../services/barrel';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { parseUrl } from 'src/common/url';
import { Logout, JwtInfoDto } from 'src/ngxs/models/authState.model';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.template.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    title: string;
    userInfo: ParsedJwtInfo;

    @Select(state => state.router)
    routeState$: Observable<any>;

    constructor(
        private store: Store,
        private menuService: MenuService,
        public authService: AuthService
    ) { }
    ngOnInit(): void {
        this.routeState$.subscribe(routerState => {
            if (routerState.state) {
                const stateUrl = parseUrl(routerState.state.url);
                const menuItem = this.menuService.items.filter(item => {
                    if (routerState.state.params.id) {
                        return item.routeUrl === stateUrl.substring(0, stateUrl.lastIndexOf('/'))
                    }
                    return item.routeUrl === stateUrl
                });
                this.title = menuItem.pop().label;
            }
        });
        this.authService.getUserInfo()
            .pipe(
                tap((userInfo) => {
                    this.userInfo = Object.assign({}, userInfo);
                })
            ).subscribe();
    }

    logout () {
        this.store.dispatch(new Logout());
    }
}
