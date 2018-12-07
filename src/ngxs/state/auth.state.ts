import { AuthStateModel, Login, Logout, JwtInfoDto } from "../models/authState.model";
import { StateContext, Action, Selector, State } from "@ngxs/store";
import { AuthService } from "src/services/auth.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@State<AuthStateModel>({
    name: 'auth'
})
export class AuthState {

    @Selector()
    static token(state: AuthStateModel) { return state.token; }

    constructor(
        private router: Router,
        private authService: AuthService) { }

    @Action(Login)
    login({ patchState }: StateContext<AuthStateModel>, { payload }: Login) {
        return this.authService.login(payload).pipe(
            tap((result: AuthStateModel) => {
                patchState({ token: result.token, refresh: result.refresh, username: payload.username });
                this.router.navigate(['/dashboard'])
            }
        ))
    }

    @Action(Logout)
    logout({ setState }: StateContext<AuthStateModel>) {
        return this.authService.logout().pipe(tap(() => {
            setState({ token: null, username: null, password: null });
        }))
    }

}