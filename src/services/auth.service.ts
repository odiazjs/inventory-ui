import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { HttpWrapper } from 'src/common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { AuthStateModel, JwtInfoDto, Logout } from 'src/ngxs/models/authState.model';
import { Select, Store } from '@ngxs/store';
import { parseJwt } from 'src/common/authUtils';
import { map } from 'rxjs/operators';

export interface ParsedJwtInfo {
    token_type: string;
    exp: number;
    jti: string;
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
}

@Injectable()
export class AuthService extends ResourceService<any> {
    @Select(state => state.auth) authInfo$: Observable<AuthStateModel>;
    constructor(
        private store: Store,
        httpWrapper: HttpWrapper<HttpResponse<any>>
    ) {
        super(
            httpWrapper,
            urlConfig.authUrl,
            authServiceFactory
        )
    }
    login(payload): Observable<any> {
        return this.create(payload);
    }
    logout() {
        window.location.reload();
    }
    getUserInfo (): Observable<ParsedJwtInfo> {
        return this.authInfo$.pipe(
            map((result) => {
                return parseJwt(result.token)
            })
        )
    }
}

const authServiceFactory = (dto: JwtInfoDto) => {
    return new AuthStateModel(dto);
}