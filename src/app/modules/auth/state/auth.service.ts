import { Injectable } from '@angular/core';
import { AuthState, IAuthState } from './auth.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Auth } from './auth.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    @Select(AuthState.authenticated)
    public readonly authenticated$!: Observable<boolean>;

    @Select(AuthState.user)
    public readonly user$!: Observable<string>;

    public constructor(private readonly _store: Store) {}

    get isAuthenticated(): boolean {
        return !!this.token;
    }

    get token(): string {
        return this._store.selectSnapshot(AuthState.token);
    }

    getToken(): void {
        this._store.dispatch(Auth.GetToken);
    }

    refreshToken(authentication = false): Observable<IAuthState> {
        // acquireTokenSilent
        return this._store.dispatch(new Auth.Refresh(authentication)) as Observable<IAuthState>;
    }
}
