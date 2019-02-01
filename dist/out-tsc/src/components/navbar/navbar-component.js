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
import { MenuService } from '../../services/barrel';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
export var NavbarComponent = (function () {
    function NavbarComponent(menuService) {
        this.menuService = menuService;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routeState$.subscribe(function (routerState) {
            if (routerState.state) {
                var parseUrl = function (url) {
                    return url.substring(0, url.lastIndexOf('/'));
                };
                var stateUrl_1 = routerState.state.url;
                _this.title = _this.menuService.items.filter(function (item) { return item.routeUrl === stateUrl_1; }).pop().label;
            }
        });
    };
    __decorate([
        Select(function (state) { return state.router; }), 
        __metadata('design:type', Observable)
    ], NavbarComponent.prototype, "routeState$", void 0);
    NavbarComponent = __decorate([
        Component({
            selector: 'app-navbar',
            templateUrl: './navbar.template.html',
            styleUrls: ['./navbar.component.scss']
        }), 
        __metadata('design:paramtypes', [MenuService])
    ], NavbarComponent);
    return NavbarComponent;
}());
//# sourceMappingURL=navbar-component.js.map