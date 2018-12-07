import { Component, Inject, AfterViewInit } from '@angular/core';
import { HttpWrapper } from '../common/barrel';
import { HttpResponse } from '@angular/common/http';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateModel } from 'src/ngxs/models/authState.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'inventory-ui';
  @Select(state => state.auth) authInfo$: Observable<AuthStateModel>;
  constructor(
    private router: Router,
    @Inject(HttpWrapper) public httpWrapper: HttpWrapper<HttpResponse<{}>>
  ) {
    
  }

  ngAfterViewInit () {
    this.authInfo$.subscribe(result => {
      if(!result.token) {
        this.router.navigate(['/login']);
      }
    })
  }
}
