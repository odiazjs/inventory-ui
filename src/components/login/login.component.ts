import { Component, OnInit } from '@angular/core';
import { AuthStateModel, Login } from 'src/ngxs/models/authState.model';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-login',
    templateUrl: './login.template.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    authStateModel: AuthStateModel = { username: null, password: null };

    constructor(
        private store: Store,
    ) { }

    ngOnInit(): void {

    }

    login() {
        this.store.dispatch(new Login(this.authStateModel))
            .subscribe((result) => {
                console.log('logged in', result)
            })
    }

}