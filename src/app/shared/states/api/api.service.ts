import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { APIState, IAPIState } from './api.state';
import { APIPhases } from './api.phases.actions';
import { APIFramework } from './api.framework.actions';
import { APISubPhases } from './api.subphases.actions';
import { APIMethods } from './api.methods.actions';
import { APIApproaches } from './api.approaches.actions';
import { APITasks } from './api.tasks.actions';
import type { EntityType, IPhase } from '@teq/shared/types/types';
import { APIGlossary } from './api.glossary.actions';
import { APIFaq } from './api.faq.actions';
import { IFaq } from '@teq/shared/types/faq.type';
import { IGlossary } from '@teq/shared/types/glossary.type';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    @Select(APIState.phases)
    public readonly phases$!: Observable<IPhase[]>;

    @Select(APIState.faq)
    public readonly faq$!: Observable<IFaq[]>;

    @Select(APIState.glossary)
    public readonly glossary$!: Observable<IGlossary[]>;

    @Select(APIState.treeStatus)
    public readonly treeStatus$!: Observable<{ fetched: boolean; fetching: boolean }>;

    constructor(private readonly _store: Store) {}

    getDataTree(): Observable<unknown> {
        return this._store.dispatch(new APIFramework.FetchTree());
    }

    /**
     * Given an entity type and id fetches the requested entity trough the state  instance
     */
    getDetails(type: EntityType, id: string, forceRefresh = false): Observable<unknown> {
        if (!forceRefresh && this._hasStaleRepresentation(type, id)) {
            // Preserve stale data
            return of(null);
        }

        switch (type) {
            case 'phase':
                return this.getPhase(id);

            case 'subphase':
                return this.getSubPhase(id);

            case 'method':
                return this.getMethod(id);

            case 'approach':
                return this.getApproach(id);

            case 'task':
                return this.getTask(id);
        }
    }

    getPhase(id: string): Observable<unknown> {
        return this._store.dispatch(new APIPhases.Get(id));
    }

    getSubPhase(id: string): Observable<unknown> {
        return this._store.dispatch(new APISubPhases.Get(id));
    }

    getMethod(id: string): Observable<unknown> {
        return this._store.dispatch(new APIMethods.Get(id));
    }

    getApproach(id: string): Observable<unknown> {
        return this._store.dispatch(new APIApproaches.Get(id));
    }

    getTask(id: string): Observable<unknown> {
        return this._store.dispatch(new APITasks.Get(id));
    }

    private _hasStaleRepresentation(type: EntityType, id: string): boolean {
        const phases = this._store.selectSnapshot<IPhase[]>(({ api }: { api: IAPIState }) => api.phases);

        switch (type) {
            case 'phase':
                return !!phases.find(p => p.id === id)?.description;

            case 'subphase':
                return !!phases.find(p => !!p.subphases?.find(s => s.id === id)?.description);

            case 'method':
                return !!phases.find(p => p.subphases?.find(s => !!s.methods.find(m => m.id === id)?.description));

            case 'approach':
                return !!phases.find(p => p.subphases?.find(s => s.methods.find(m => !!m.approaches.find(a => a.id === id)?.description)));

            case 'task':
                return !!phases.find(p => p.subphases?.find(s => s.methods.find(m => m.approaches.find(a => !!a.tasks.find(t => t.id === id)?.how))));
        }
    }

    getGlossary(): Observable<unknown> {
        return this._store.dispatch(new APIGlossary.List());
    }

    getFaq(): Observable<unknown> {
        return this._store.dispatch(new APIFaq.List());
    }
}
