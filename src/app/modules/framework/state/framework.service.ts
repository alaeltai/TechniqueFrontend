import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FrameworkState } from '@teq/modules/framework/state/framework.state';
import { IPhase } from '@teq/shared/types/phase.type';
import { LoadPhases } from '@teq/modules/framework/state/framework.actions';
import { IPagination } from '@teq/shared/types/pagination.type';
import { FrameworkPagination } from './framework.pagination.actions';
import { ISVGRenderingOptions } from '@teq/shared/types/svg.type';
import { FrameworkSVGRenderer } from './framework.svg.actions';

@Injectable()
export class FrameworkService {
    @Select(FrameworkState.phases)
    public readonly phases$!: Observable<IPhase[]>;

    @Select(FrameworkState.pagination)
    public readonly pagination$!: Observable<IPagination>;

    @Select(FrameworkState.svgOptions)
    public readonly svgOptions$!: Observable<ISVGRenderingOptions>;

    constructor(private readonly _store: Store) {}

    loadPhases(): void {
        this._store.dispatch(new LoadPhases());
    }

    paginationChanged(pagination: IPagination): void {
        this._store.dispatch(new FrameworkPagination.Change(pagination));
    }

    svgRenderingOptionsChanged(options: ISVGRenderingOptions): void {
        this._store.dispatch(new FrameworkSVGRenderer.Change(options));
    }
}
