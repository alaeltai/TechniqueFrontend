/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, catchError, throwError, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImportFrameworkService {
    public progress = signal(0);

    constructor(private readonly _http: HttpClient) {}

    upload(file: File): Observable<any> {
        this.progress.set(1);

        const formData = new FormData();
        formData.append('file', file);

        return this._http
            .post('/api/upload', formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                map((event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress.set(Math.round((100 / event.total) * event.loaded));
                    } else if (event.type === HttpEventType.Response) {
                        this.progress.set(0);
                    }
                }),
                catchError((err: Error) => {
                    this.progress.set(0);
                    alert(err.message);
                    return throwError(() => new Error(err.message));
                })
            );
    }
}
