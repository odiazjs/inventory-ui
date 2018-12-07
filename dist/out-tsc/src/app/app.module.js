var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';
import { AppComponent } from './app.component';
import { COMMON_MODULES } from '../common';
import { APP_COMPONENTS } from '../components';
import { RouterModule } from '@angular/router';
import { APP_SERVICES } from '../services';
import { appRoutes } from './routes';
import { HttpModule } from '@angular/http';
var APP_COMMON_MODULES = [
    BrowserModule,
    HttpClientModule
];
import { FormatDatePipe } from '../common/date.pipe';
import { HttpWrapper } from '../common/http-wrapper';
import { HttpClientModule } from '@angular/common/http';
// Map the router snapshot to { url, params, queryParams }
export var CustomRouterStateSerializer = (function () {
    function CustomRouterStateSerializer() {
    }
    CustomRouterStateSerializer.prototype.serialize = function (routerState) {
        var url = routerState.url, queryParams = routerState.root.queryParams;
        var route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        var params = route.params;
        return { url: url, params: params, queryParams: queryParams };
    };
    return CustomRouterStateSerializer;
}());
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent
            ].concat(APP_COMPONENTS, [
                FormatDatePipe
            ]),
            imports: [
                HttpModule,
                FormsModule
            ].concat(APP_COMMON_MODULES, [
                RouterModule.forRoot(appRoutes, { enableTracing: false }),
                NgxsModule.forRoot([]),
                NgxsRouterPluginModule.forRoot()
            ]),
            providers: [
                HttpWrapper
            ].concat(APP_SERVICES, COMMON_MODULES, [
                { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
            ]),
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map