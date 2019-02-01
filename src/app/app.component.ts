import { Component, Inject, AfterViewInit } from '@angular/core';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateModel, Logout } from 'src/ngxs/models/authState.model';
import { Router } from '@angular/router';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'inventory-ui';
  @Select(state => state.auth) authInfo$: Observable<AuthStateModel>;
  constructor(
    private store: Store,
    private router: Router,
    @Inject(HttpWrapper) public httpWrapper: HttpWrapper<HttpResponse<{}>>
  ) {

  }

  ngAfterViewInit() {
    this.authInfo$.subscribe(result => {
      if (!result.token) {
        this.router.navigate(['/login']);
      }
      const pjson = require('../../package.json');
      console.info('Currently on app version -- ', pjson.version);
      let version = pjson.version.split('.');
      let existingVersion = localStorage.getItem('app-version');
      if (existingVersion) {
        existingVersion = JSON.parse(existingVersion).split('.');
      }
      if (!existingVersion) {
        localStorage.setItem('app-version', JSON.stringify(pjson.version))
      } else {
        if (version[0] > existingVersion[0]) {
          this.store.reset({});
          localStorage.setItem('app-version', JSON.stringify(pjson.version))
        }
      }
    })
  }
}
