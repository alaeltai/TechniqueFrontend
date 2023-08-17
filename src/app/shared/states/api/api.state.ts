/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IPhase } from '@teq/shared/types/phase.type';
import { catchError } from 'rxjs/operators';
import { APIPhases } from './api.phases.actions';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { IAPIPhase } from '@teq/shared/types/api/phase.type';
import { ISubphase } from '@teq/shared/types/subphase.type';
import { IMethod } from '@teq/shared/types/method.type';
import { IApproach } from '@teq/shared/types/approach.type';
import { IAPIRole } from '@teq/shared/types/api/role.type';
import { IRole } from '@teq/shared/types/roles.type';
import { determineRoleColor, normalizeName } from '@teq/shared/lib/roles.lib';
import { IAPITask } from '@teq/shared/types/api/task.type';
import { ITask } from '@teq/shared/types/task.type';
import { ICategory } from '@teq/shared/types/category.type';
import { IAPICategory } from '@teq/shared/types/api/category.type';
import { IAPIApproach } from '@teq/shared/types/api/approach.type';
import { IAPIMethod } from '@teq/shared/types/api/method.type';
import { IAPISubPhase } from '@teq/shared/types/api/subphase.type';
// import { phases } from './mock'; // Mock point
import { environment } from 'environments/environment';
import { IArtefact } from '@teq/shared/types/artefact.type';
import { IAPIOwner } from '@teq/shared/types/api/owner.type';
import { IOwner } from '@teq/shared/types/owner.type';
import { AuthenticatedRequest } from '../../../core/inteceptors/auth.interceptor';
import { IAPIArtefactUrl } from '@teq/shared/types/api/artefactUrl.type';
import { APIFramework } from './api.framework.actions';
import { CachePolicy, CacheStorage, CacheType, CachingPolicy } from '@teq/core/inteceptors/cache.interceptor';
import { APISubPhases } from './api.subphases.actions';
import { APIMethods } from './api.methods.actions';
import { APIApproaches } from './api.approaches.actions';
import { APITasks } from './api.tasks.actions';
import { IAPITemplate } from '@teq/shared/types/api/template.type';
import { ITemplate } from '@teq/shared/types/template.type';

const phases: IAPIPhase[] = []; // Coment to enable mock

export interface IAPIState {
    phases: IPhase[];
}

const defaults: IAPIState = {
    phases: []
};

@State<IAPIState>({
    name: 'api',
    defaults
})
@Injectable()
export class APIState {
    @Selector()
    static phases(state: IAPIState): IPhase[] {
        return state.phases;
    }

    public static sortByOrder<T extends { order?: number }>(a: T, b: T): number {
        return (a.order ?? 0) - (b.order ?? 0);
    }

    public static convertPhase(phase: IAPIPhase): IPhase {
        return {
            id: phase.Id,
            name: phase.Name,
            description: phase.Description,
            order: phase.Order,
            subphases: phase.SubPhases.map(APIState.convertSubPhase).sort(APIState.sortByOrder)
        };
    }

    public static convertSubPhase(subPhase: IAPISubPhase): ISubphase {
        return {
            id: subPhase.Id,
            name: subPhase.Name,
            description: subPhase.Description,
            order: subPhase.Order,
            methods: subPhase.Methods.map(APIState.convertMethod).sort(APIState.sortByOrder)
        };
    }

    public static convertMethod(method: IAPIMethod): IMethod {
        return {
            id: method.Id,
            name: method.Name,
            description: method.Description,
            order: method.Order,
            approaches: method.Approaches.map(APIState.convertApproach).sort(APIState.sortByOrder)
        };
    }

    public static convertApproach(approach: IAPIApproach): IApproach {
        return {
            id: approach.Id,
            name: approach.Name,
            description: approach.Description,
            order: approach.Order,
            roles: [approach.Accountable, ...approach.Responsibles].filter(Boolean).map(APIState.convertRole),
            tasks: approach.Tasks.filter(t => t.Name !== null)
                .map(APIState.convertTask)
                .sort(APIState.sortByOrder),
            templates: approach.Templates?.map(APIState.convertTemplate) ?? []
        };
    }

    public static convertTemplate(template: IAPITemplate): ITemplate {
        return {
            id: template.Id,
            name: template.Name
        };
    }

    public static convertRole(role: IAPIRole): IRole {
        const name = normalizeName(role.Name);

        return determineRoleColor({
            id: role.Id,
            name,
            description: role.Description,
            skills: role.Skills
        });
    }

    public static convertTask(task: IAPITask): ITask {
        return {
            id: task.Id,
            name: task.Name,
            order: task.Order,
            responsible: APIState.convertRole(task.Responsible),
            purpose: task.Purpose,
            how: task.How,
            category: APIState.convertCategory(task.Category),
            artefacts: APIState.convertArtefactUrl(task.TaskArtefactOutputUrls)
        };
    }

    public static convertCategory(category: IAPICategory): ICategory {
        return {
            id: category.Id,
            name: category.Name
        };
    }

    public static convertArtefactUrl(artefactUrls: IAPIArtefactUrl[]): IArtefact[] {
        return artefactUrls?.map<IArtefact>((artefactUrl: IAPIArtefactUrl) => {
            return {
                id: artefactUrl.Artefact.Id,
                name: artefactUrl.Artefact.Name.trim(),
                description: artefactUrl.Artefact.Description,
                // owner: APIState.convertOwner(artefact.Owner),
                refNo: artefactUrl.Artefact.RefNo
            } satisfies IArtefact;
        });
    }

    public static convertOwner(owner: IAPIOwner): IOwner {
        return {
            id: owner.Id,
            name: owner.Name
        };
    }

    constructor(private readonly _authService: AuthService, private readonly _http: HttpClient) {}

    @Action(APIFramework.FetchTree)
    fetchDataTree({ patchState }: StateContext<IAPIState>): void {
        console.log('In handler getter');

        const response = this._http
            .get<IAPIPhase[]>(`${environment.apiConfig.uri}/fullframework`, {
                responseType: 'json',
                context: new HttpContext()
                    .set(CacheStorage, CacheType.FULL_FRAMEWORK)
                    .set(CachePolicy, CachingPolicy.STALE_WHILE_REVALIDATE)
                    .set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('tree')));

        response.subscribe(rawPhases => {
            // Convert IAPIPhase to IPhase
            const phases = (rawPhases as IAPIPhase[]).map(APIState.convertPhase).sort(APIState.sortByOrder);

            // Persist newly fetched data in state
            patchState({ phases });
        });
    }

    @Action(APIPhases.Get)
    getPhase({ patchState, getState }: StateContext<IAPIState>, { id }: APIPhases.Get): void {
        const response = this._http
            .get<IAPIPhase>(`${environment.apiConfig.uri}/phases/${id}`, {
                responseType: 'json',
                context: new HttpContext().set(CacheStorage, CacheType.PHASES).set(CachePolicy, CachingPolicy.CACHE_FIRST).set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('phase')));

        response.subscribe(resp => {
            if (resp) {
                const phase = APIState.convertPhase(resp as IAPIPhase);

                patchState({ phases: getState().phases.map(p => (p.id === id ? { ...p, description: phase.description } : p)) });
            }
        });
    }

    @Action(APISubPhases.Get)
    getSubPhase({ patchState, getState }: StateContext<IAPIState>, { id }: APISubPhases.Get): void {
        const response = this._http
            .get<IAPISubPhase>(`${environment.apiConfig.uri}/subphases/${id}`, {
                responseType: 'json',
                context: new HttpContext().set(CacheStorage, CacheType.SUBPHASES).set(CachePolicy, CachingPolicy.CACHE_FIRST).set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('subphase')));

        response.subscribe(resp => {
            if (resp) {
                const subphase = APIState.convertSubPhase(resp as IAPISubPhase);

                patchState({
                    phases: getState().phases.map(p => ({
                        ...p,
                        subphases: p.subphases?.map((s: ISubphase) => (s.id === id ? { ...s, description: subphase.description } : s))
                    }))
                });
            }
        });
    }

    @Action(APIMethods.Get)
    getMethod({ patchState, getState }: StateContext<IAPIState>, { id }: APIMethods.Get): void {
        const response = this._http
            .get<IAPIMethod>(`${environment.apiConfig.uri}/methods/${id}`, {
                responseType: 'json',
                context: new HttpContext().set(CacheStorage, CacheType.METHODS).set(CachePolicy, CachingPolicy.CACHE_FIRST).set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('method')));

        response.subscribe(resp => {
            if (resp) {
                const method = APIState.convertMethod(resp as IAPIMethod);

                patchState({
                    phases: getState().phases.map(p => ({
                        ...p,
                        subphases: p.subphases?.map((s: ISubphase) => ({
                            ...s,
                            methods: s.methods.map(m =>
                                m.id === id
                                    ? {
                                          ...m,
                                          description: method.description
                                      }
                                    : m
                            )
                        }))
                    }))
                });
            }
        });
    }

    @Action(APIApproaches.Get)
    getApproach({ patchState, getState }: StateContext<IAPIState>, { id }: APIApproaches.Get): void {
        const response = this._http
            .get<IAPIMethod>(`${environment.apiConfig.uri}/approaches/${id}`, {
                responseType: 'json',
                context: new HttpContext().set(CacheStorage, CacheType.APPROACHES).set(CachePolicy, CachingPolicy.CACHE_FIRST).set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('method')));

        response.subscribe(resp => {
            if (resp) {
                const approach = APIState.convertApproach(resp as IAPIApproach);

                patchState({
                    phases: getState().phases.map(p => ({
                        ...p,
                        subphases: p.subphases?.map((s: ISubphase) => ({
                            ...s,
                            methods: s.methods.map(m => ({
                                ...m,
                                approaches: m.approaches.map(a =>
                                    a.id === id
                                        ? {
                                              ...a,
                                              description: approach.description
                                          }
                                        : a
                                )
                            }))
                        }))
                    }))
                });
            }
        });
    }

    @Action(APITasks.Get)
    getTask({ patchState, getState }: StateContext<IAPIState>, { id }: APITasks.Get): void {
        const response = this._http
            .get<IAPIMethod>(`${environment.apiConfig.uri}/approaches/${id}`, {
                responseType: 'json',
                context: new HttpContext().set(CacheStorage, CacheType.TASKS).set(CachePolicy, CachingPolicy.CACHE_FIRST).set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('method')));

        response.subscribe(resp => {
            if (resp) {
                const task = APIState.convertTask(resp as IAPITask);

                patchState({
                    phases: getState().phases.map(p => ({
                        ...p,
                        subphases: p.subphases?.map((s: ISubphase) => ({
                            ...s,
                            methods: s.methods.map(m => ({
                                ...m,
                                approaches: m.approaches.map(a => ({
                                    ...a,
                                    tasks: a.tasks.map(t =>
                                        t.id === id
                                            ? {
                                                  ...t,
                                                  how: task.how,
                                                  purpose: task.purpose
                                              }
                                            : t
                                    )
                                }))
                            }))
                        }))
                    }))
                });
            }
        });
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: Error): Observable<T> => {
            console.error(operation, error);

            // Let the app keep running by returning an empty result.
            if (operation === 'tree') {
                return of(phases as T); // Mock point
                // return of([] as T);
            } else {
                return of(null as T);
            }
        };
    }
}
