export const AUTH_STATE_LOGIN = 'Auth_Login'
export const AUTH_STATE_LOGOUT = 'Auth_Logout'

export class JwtInfoDto {
    access: string;
    refresh: string;
}

export class AuthStateModel {
    constructor (dto: JwtInfoDto) {
        this.token = dto.access;
        this.refresh = dto.refresh;
    }
    token?: string;
    refresh?: string;
    username: string;
    password: string;
}

export class Login {
    static readonly type = 'Auth_Login';
    constructor(public payload: { username: string, password: string }) { }
}

export class Logout {
    static readonly type = 'Auth_Logout';
}