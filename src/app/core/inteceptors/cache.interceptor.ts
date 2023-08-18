import { HttpContextToken, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from } from 'rxjs';

export enum CacheType {
    NONE = 0,
    PHASES = 95,
    SUBPHASES = 96,
    METHODS = 97,
    APPROACHES = 98,
    TASKS = 99,
    FULL_FRAMEWORK = 100
}

export enum CachingPolicy {
    NONE = 0,
    STALE_WHILE_REVALIDATE = 10,
    CACHE_FIRST = 11
}

export const CacheStorage = new HttpContextToken<CacheType>(() => CacheType.NONE);
export const CachePolicy = new HttpContextToken<CachingPolicy>(() => CachingPolicy.NONE);

const availableCaches = {
    [CacheType.FULL_FRAMEWORK]: 'full-framework-cache'
};

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request);

        if (request.method !== 'GET') {
            return next.handle(request);
        }

        const cacheStorage = request.context.get(CacheStorage);
        const cachingPolicy = request.context.get(CachePolicy);

        console.log('In interceptor');

        if (cacheStorage !== CacheType.NONE) {
            if (cachingPolicy === CachingPolicy.STALE_WHILE_REVALIDATE) {
                return from(this.staleWhileRevalidate(cacheStorage, request, next));
            } else if (cachingPolicy === CachingPolicy.CACHE_FIRST) {
                return from(this.cacheFirst(cacheStorage, request, next));
            }
        }

        // Only handle requests specifically marked for caching
        return next.handle(request);
    }

    private async staleWhileRevalidate(storage: CacheType, request: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<unknown>> {
        const refetch = this.fetchFresh(storage, request, next); // Start fetching early
        const cached = await this.getFromCache(storage, request.url);
        let response: HttpEvent<unknown>;

        if (cached) {
            // Return from cache
            response = new HttpResponse<unknown>({
                body: cached.body,
                headers: new HttpHeaders(cached.headers),
                status: cached.status,
                statusText: cached.statusText,
                url: cached.url
            });
        } else {
            // Await fresh data fetch if cache missed
            response = await refetch;
        }

        return response;
    }

    private async cacheFirst(storage: CacheType, request: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<unknown>> {
        const cached = await this.getFromCache(storage, request.url);
        let response: HttpEvent<unknown>;

        if (cached) {
            // Return from cache
            response = new HttpResponse<unknown>({
                body: cached.body,
                headers: new HttpHeaders(cached.headers),
                status: cached.status,
                statusText: cached.statusText,
                url: cached.url
            });
        } else {
            // Fetch new data if nothing hit in cache
            response = await this.fetchFresh(storage, request, next);
        }

        return response;
    }

    private async fetchFresh(storage: CacheType, request: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<unknown>> {
        return await new Promise<HttpEvent<unknown>>((resolve, reject) => {
            next.handle(request)
                .pipe(
                    catchError((_, caught) => {
                        reject(caught);

                        return caught;
                    })
                )
                .subscribe((resp: HttpEvent<unknown>) => {
                    if (resp instanceof HttpResponse && resp.status === 200) {
                        // Commit the new version to cache
                        this.cacheResponse(storage, request.url, resp);
                    } else {
                        resolve(resp);
                    }
                });
        });
        // private toObserver(promise: Pormise<HttpEvent<unknown>>): Observable<HttpEvent<unknonw>> {
        //     return new Observable(observer => {
        //         const abortController = new AbortController();
        //         const subscription = from(
        //             fetch(url, {
        //                 signal: abortController.signal
        //             })
        //         ).subscribe(observer);

        //         return () => {
        //             abortController.abort();
        //             subscription.unsubscribe();
        //         };
        //     });
        // }
    }

    private cacheResponse(cache: CacheType | Cache, key: RequestInfo | URL, response: HttpEvent<unknown>): void {
        if (response instanceof HttpResponse && response.status === 200) {
            // Cache the new response
            void this.setInCache(cache, key, response.clone() as unknown as Response);
        }
    }

    private async getCache(type: CacheType): Promise<Cache | null> {
        if (type in availableCaches) {
            try {
                return await caches.open(availableCaches[type as keyof typeof availableCaches]);
            } catch (_) {
                // Do nothing
            }
        }

        return null;
    }

    private async getFromCache(c: CacheType | Cache, key: RequestInfo | URL): Promise<Response | null> {
        let cache: Cache | null;

        if (!(c instanceof Cache)) {
            const cc = await this.getCache(c);

            cache = cc;
        } else {
            cache = c;
        }

        if (cache) {
            try {
                const response = await cache.match(key);

                if (response) {
                    return response;
                }
            } catch (_) {
                // Do nothing
            }
        }

        return null;
    }

    private async setInCache(c: CacheType | Cache, key: RequestInfo | URL, value: Response): Promise<boolean> {
        let cache: Cache | null;

        if (!(c instanceof Cache)) {
            const cc = await this.getCache(c);

            cache = cc;
        } else {
            cache = c;
        }

        if (cache) {
            try {
                await cache.put(key, value);

                return true;
            } catch (_) {
                // Do nothing
            }
        }

        return false;
    }
}
