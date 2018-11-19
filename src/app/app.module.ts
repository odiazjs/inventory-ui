import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsModule, } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';

import { AppComponent } from './app.component';

// Common Modules
import { COMMON_MODULES } from '../common';

// App Components
import { APP_COMPONENTS } from '../components'
import { RouterModule } from '@angular/router';

// App Services
import { APP_SERVICES } from '../services'

// Routes Config
import { appRoutes } from './routes';
import { HttpModule } from '@angular/http';

const APP_COMMON_MODULES = [
  BrowserModule,
  HttpClientModule
];

// Custom Ngxs Router serializer
import { Params, RouterStateSnapshot } from '@angular/router';
import { FormatDatePipe } from '../common/date.pipe';
import { HttpWrapper } from '../common/http-wrapper';
import { HttpClientModule } from '@angular/common/http';
import { KeysPipe } from 'src/common/keys.pipe';

​
export interface RouterStateParams {
  url: string;
  params: Params;
  queryParams: Params;
}
​
// Map the router snapshot to { url, params, queryParams }
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateParams> {
  serialize(routerState: RouterStateSnapshot): RouterStateParams {
    const {
      url,
      root: { queryParams }
    } = routerState;
​
    let { root: route } = routerState;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { params } = route;
    return { url, params, queryParams };
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ...APP_COMPONENTS,
    FormatDatePipe,
    KeysPipe
  ],
  imports: [
    HttpModule,
    FormsModule,
    ...APP_COMMON_MODULES,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    NgxsModule.forRoot([

    ]),
    NgxsRouterPluginModule.forRoot()
  ],
  providers: [
    HttpWrapper,
    ...APP_SERVICES,
    ...COMMON_MODULES,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
