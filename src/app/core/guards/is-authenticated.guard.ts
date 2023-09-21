import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TeqRoutesEnum } from '../routing/teq-routing/teq-routes.enum';
import { AuthRoutesEnum } from '@teq/modules/auth/auth-routes.enum';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { Observable, take } from 'rxjs';

let priorToRedirect = '';

export const isAuthenticatedGuard: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const isAuth = authService.authenticated$;
    const router = inject(Router);

    // Mark the route as requiring authentication
    authService.registerAuthPath(state.url);

    const resolveRoute = new Observable<boolean | UrlTree>(observer => {
        isAuth.pipe(take(1)).subscribe(authenticated => {
            const isAuthUrl = state.url.includes(TeqRoutesEnum.AUTH);

            if (!authenticated && !isAuthUrl) {
                // Move unauthenticated users to the auth page
                priorToRedirect = location.pathname;

                void router.navigate([`/${TeqRoutesEnum.AUTH}/${AuthRoutesEnum.LOGIN}`]);

                observer.next(false);
            } else {
                if (authenticated && priorToRedirect && location.pathname !== priorToRedirect) {
                    void router.navigate([priorToRedirect]);

                    priorToRedirect = '';

                    observer.next(false);
                } else {
                    observer.next(true);
                }
            }
        });
    });

    return resolveRoute;
};
