import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { Observable } from 'rxjs';

export const AuthenticatedRequest = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthenticatedInterceptor implements HttpInterceptor {
    constructor(private readonly _authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let req = request;

        if (request.context.get(AuthenticatedRequest)) {
            req = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${this._authService.token}`)
            });
        }

        return next.handle(req);
    }
}
