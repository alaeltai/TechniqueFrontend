import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPagination } from '@teq/shared/types/pagination.type';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    private readonly _pagination = new BehaviorSubject<IPagination>({
        page: 1,
        zoom: 1
    });

    public get pagination$(): Observable<IPagination> {
        return this._pagination.asObservable();
    }

    public get snapshot(): IPagination {
        return this._pagination.value;
    }

    public get zoom(): number {
        return this._pagination.value.zoom;
    }

    public get page(): number {
        return this._pagination.value.page;
    }

    public setPagination(pagination: IPagination): void {
        this._pagination.next(pagination);
    }

    public setPage(page: number): void {
        this._pagination.next({
            ...this._pagination.value,
            page
        });
    }

    public setZoom(zoom: number): void {
        this._pagination.next({
            ...this._pagination.value,
            zoom
        });
    }
}
