import { Component, Inject, AfterViewInit } from '@angular/core';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateModel } from 'src/ngxs/models/authState.model';
import { Router } from '@angular/router';
import { sharedService } from '../common/sharedService';
import { NotificationService, Message, AlertType } from 'src/services/notifications.service';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'inventory-ui';
  sharedService = sharedService;
  @Select(state => state.auth) authInfo$: Observable<AuthStateModel>;
  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(HttpWrapper) public httpWrapper: HttpWrapper<HttpResponse<{}>>
  ) {

  }

  addNotification () {
    const message: Message = {
        body: `Your order has beed saved succesfully with Id - 000001`,
        timeout: 2000,
        type: AlertType.success
    }
    this.notificationService.push(message)
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
