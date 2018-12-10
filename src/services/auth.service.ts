import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { HttpWrapper } from 'src/common/barrel';
import { HttpResponse } from '@angular/common/http';
import { urlConfig } from '../environments/config';
import { AuthStateModel, JwtInfoDto } from 'src/ngxs/models/authState.model';
import { AuthStateDto } from 'src/models/auth.dto';

@Injectable()
export class AuthService extends ResourceService<any> {
    constructor(httpWrapper: HttpWrapper<HttpResponse<any>>) {
        super(
            httpWrapper,
            urlConfig.authUrl,
            authServiceFactory
        )
    }
    login(payload): Observable<any> {
        return this.create(payload);
    }
    logout(): Observable<any> {
        return Observable.of([]);
    }
}

const authServiceFactory = (dto: JwtInfoDto) => {
    console.log('auth - serializer', dto);
    return new AuthStateModel(dto);
}