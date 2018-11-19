import { Component, Inject } from '@angular/core';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inventory-ui';
  constructor(
    @Inject(HttpWrapper) public httpWrapper: HttpWrapper<HttpResponse<{}>>
  ) {

  }
}
