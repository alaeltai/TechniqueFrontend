import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticatedInterceptor } from './auth.interceptor';
import { CachingInterceptor } from './cache.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticatedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }
];
