import { Observable } from 'rxjs';

export function idle<T>(timeout = 0): Observable<T> {
    console.log('idle created');

    return new Observable<T>(observer => {
        console.log('idle called');

        const handle = requestIdleCallback(
            () => {
                console.log('in idle');

                observer.next();
                observer.complete();
            },
            {
                timeout
            }
        );

        return () => {
            console.log('idle canceled');
            cancelIdleCallback(handle);
        };
    });
}
