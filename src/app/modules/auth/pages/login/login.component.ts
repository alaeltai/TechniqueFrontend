import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TeqRoutesEnum } from '@teq/core/routing/teq-routing/teq-routes.enum';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { expandAndShrink, fadeIn, fadeOutState } from '@teq/shared/animations/animations.lib';
import { APIService } from '@teq/shared/states/api/api.service';

@UntilDestroy()
@Component({
    selector: 'teq-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [expandAndShrink, fadeOutState, fadeIn]
})
export class LoginComponent implements OnInit {
    public loginSuccsessfully = false;

    public loggingIn = false;

    public evaluatedSession = false;

    get stateName(): string {
        return this.loginSuccsessfully.toString();
    }

    constructor(private readonly _router: Router, private readonly _authService: AuthService, private readonly _apiService: APIService) {}

    ngOnInit(): void {
        this._authService.getToken();

        this._authService.authenticated$.pipe(untilDestroyed(this)).subscribe(authenticated => {
            this.evaluatedSession = !authenticated; // End of session validation

            if (!this.loggingIn && authenticated) {
                requestIdleCallback(
                    // Pre-fetch the data tree as it is required for all functionality (once authenticated)
                    () => this._apiService.getDataTree()
                );

                // Authenticated based on initial getToken without any suplemental manual login
                void this._router.navigate([`/${TeqRoutesEnum.LANDING_PAGE}`]);
            }
        });
    }

    login(): void {
        this.loggingIn = true;

        this._authService
            .refreshToken(true)
            .pipe(untilDestroyed(this))
            .subscribe(_ => {
                this._authService.authenticated$.pipe(untilDestroyed(this)).subscribe(authenticated => {
                    if (authenticated) {
                        this.loginSuccsessfully = true;
                    }
                });
            });
    }

    onLoginAnimationDone(): void {
        if (this.loginSuccsessfully) {
            this.loggingIn = false;

            void this._router.navigate([`/${TeqRoutesEnum.LANDING_PAGE}`]);
        }
    }
}
