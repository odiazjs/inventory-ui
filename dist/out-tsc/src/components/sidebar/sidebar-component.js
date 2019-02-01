var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { MenuService } from '../../services/menu-service';
export var SidebarComponent = (function () {
    function SidebarComponent(store, menuService) {
        this.store = store;
        this.menuService = menuService;
        this.menu = this.menuService.items;
    }
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routeState$.subscribe(function (routerState) {
            if (routerState.state) {
                var parseUrl = function (url) {
                    return url.substring(0, url.lastIndexOf('/'));
                };
                _this.menu.map(function (item) { return item.isActive = false; });
                var stateUrl_1 = routerState.state.url;
                _this.menu.filter(function (item) { return item.routeUrl == stateUrl_1; }).pop().isActive = true;
            }
        });
    };
    SidebarComponent.prototype.setActive = function (item) {
        var selectedMenuItem = this.menu.filter(function (x) { return x.isActive; }).pop();
        if (item.label == selectedMenuItem.label) {
            return;
        }
        this.menu.forEach(function (menuItem) {
            menuItem.isActive = false;
            if (menuItem.label == item.label) {
                item.isActive = true;
            }
        });
        this.store.dispatch(new Navigate([item.routeUrl]));
    };
    __decorate([
        Select(function (state) { return state.router; }), 
        __metadata('design:type', Observable)
    ], SidebarComponent.prototype, "routeState$", void 0);
    SidebarComponent = __decorate([
        Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.template.html',
            styleUrls: ['./sidebar.component.scss']
        }), 
        __metadata('design:paramtypes', [Store, MenuService])
    ], SidebarComponent);
    return SidebarComponent;
}());
//# sourceMappingURL=sidebar-component.js.map