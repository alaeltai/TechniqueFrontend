import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Auth } from './auth.actions';
import { HttpClient } from '@angular/common/http';
import type { AuthenticationResult } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';

export interface IAuthState {
    token: string;
    user: { name: string; email: string };
    expiresOn?: number;
}

export const defaults: IAuthState = {
    token: '',
    user: { name: '', email: '' }
};

export const StoreIdentifier = 'auth';

@State<IAuthState>({
    name: StoreIdentifier,
    defaults
})
@Injectable()
export class AuthState {
    @Selector()
    static authenticated(state: IAuthState): boolean {
        return !!state.token && !!state.token.trim();
    }

    @Selector()
    static user(state: IAuthState): string {
        return state.user.name;
    }

    @Selector()
    static email(state: IAuthState): string {
        return state.user.email;
    }

    @Selector()
    static token(state: IAuthState): string {
        return state.token;
    }

    constructor(private readonly _http: HttpClient, private readonly _msalService: MsalService) {}

    /**
     * Grabs informations related to the latest user session and attempts to restore and refresh prior sessions
     */
    @Action(Auth.GetToken)
    getToken({ setState, dispatch }: StateContext<IAuthState>): void {
        const account = this._msalService.instance.getActiveAccount();

        if (account) {
            void this._msalService.instance
                .acquireTokenSilent({
                    scopes: environment.apiConfig.scopes,
                    account
                })
                .then(response => {
                    // Session restored succesfully, preserve data in state
                    setState({
                        expiresOn: response.expiresOn?.getTime() ?? Date.now() + 60 * 1000,
                        token: response.accessToken,
                        user: { name: response.account.name ?? '', email: response.account.username }
                    });
                })
                .catch(() => {
                    // Remove any left over invalid data as the user has to log in via manual input
                    dispatch(Auth.Deauthenticate);
                });
        }
    }

    @Action(Auth.Refresh)
    refreshToken({ getState, setState, dispatch }: StateContext<IAuthState>, { forceAuthenticate }: Auth.Refresh): void {
        const authState = getState();
        if (authState.token) {
            if (authState.expiresOn && Date.now() <= authState.expiresOn) {
                // Still in token validity window, validate and extend the token - attempt silent SSO
                this._msalService
                    .ssoSilent({
                        scopes: environment.apiConfig.scopes
                    })
                    .subscribe({
                        error() {
                            // Remove any left over invalid data as the user has to log in via manual input
                            dispatch(Auth.Deauthenticate);
                        },
                        next(response: AuthenticationResult) {
                            // Session restored succesfully, preserve data in state
                            setState({
                                expiresOn: response.expiresOn?.getTime() ?? Date.now() + 60 * 1000,
                                token: response.accessToken,
                                user: { name: response.account.name ?? '', email: response.account.username }
                            });
                        }
                    });
            } else {
                // Ensure left overs removal
                dispatch(new Auth.Deauthenticate());
            }
        } else if (forceAuthenticate) {
            // Authenticate using pop-up mechanism
            this._msalService
                .loginPopup({
                    scopes: environment.apiConfig.scopes
                })
                .subscribe((response: AuthenticationResult) => {
                    this._msalService.instance.setActiveAccount(response.account);

                    setState({
                        expiresOn: response.expiresOn?.getTime() ?? Date.now() + 60 * 1000,
                        token: response.accessToken,
                        user: { name: response.account.name ?? '', email: response.account.username }
                    });
                });
        } else {
            // Don't start the authentication process until the user manually engages
        }
    }

    @Action(Auth.Deauthenticate)
    deauthenticate({ setState }: StateContext<IAuthState>): void {
        setState(defaults);
    }
}
