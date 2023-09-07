import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IPhase } from '@teq/shared/types/phase.type';
import { catchError } from 'rxjs/operators';
import { APIPhases } from './api.phases.actions';
import { Observable, from, of } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
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
import { environment } from 'environments/environment';
import { IArtefact } from '@teq/shared/types/artefact.type';
import { AuthenticatedRequest } from '../../../core/inteceptors/auth.interceptor';
import { APIFramework } from './api.framework.actions';
import { CachePolicy, CacheStorage, CacheType, CachingPolicy } from '@teq/core/inteceptors/cache.interceptor';
import { APISubPhases } from './api.subphases.actions';
import { APIMethods } from './api.methods.actions';
import { APIApproaches } from './api.approaches.actions';
import { APITasks } from './api.tasks.actions';
import { IAPITemplate } from '@teq/shared/types/api/template.type';
import { ITemplate } from '@teq/shared/types/template.type';
import { IAPIArtefact } from '@teq/shared/types/api/artefact.type';
import { APIGlossary } from './api.glossary.actions';
import { IGlossary } from '@teq/shared/types/glossary.type';
import { APIFaq } from './api.faq.actions';
import { IFaq } from '@teq/shared/types/faq.type';
import { IAPIFaq } from '@teq/shared/types/api/faq.type';
import { IAPIGlossary } from '@teq/shared/types/api/glossary.type';

export interface IAPIState {
    phases: IPhase[];
    glossary: IGlossary[];
    faq: IFaq[];
    treeFetched: boolean;
    treeFetching: boolean;
}

const defaults: IAPIState = {
    phases: [],
    glossary: [],
    faq: [],
    treeFetched: false,
    treeFetching: false
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

    @Selector()
    static faq(state: IAPIState): IFaq[] {
        return state.faq;
    }

    @Selector()
    static glossary(state: IAPIState): IGlossary[] {
        return state.glossary;
    }

    @Selector()
    static treeStatus(state: IAPIState): { fetched: boolean; fetching: boolean } {
        return { fetched: state.treeFetched, fetching: state.treeFetching };
    }

    public static sortByOrder<T extends { order?: number }>(a: T, b: T): number {
        return (a.order ?? 0) - (b.order ?? 0);
    }

    public static convertPhase(phase: IAPIPhase): IPhase {
        const converted: IPhase = {
            type: 'phase',
            id: phase.id,
            _locator: phase.id,
            name: phase.name,
            description: phase.description,
            order: phase.order,
            subphases: []
        };

        converted.subphases = phase.subPhases.map(s => APIState.convertSubPhase(s, converted._locator)).sort(APIState.sortByOrder);

        return converted;
    }

    public static convertSubPhase(subPhase: IAPISubPhase, _locator = ''): ISubphase {
        const converted: ISubphase = {
            type: 'subphase',
            id: subPhase.id,
            _locator: [_locator, subPhase.id].join('.'),
            name: subPhase.name,
            description: subPhase.description,
            order: subPhase.order,
            methods: []
        };

        converted.methods = subPhase.methods.map(m => APIState.convertMethod(m, converted._locator)).sort(APIState.sortByOrder);

        return converted;
    }

    public static convertMethod(method: IAPIMethod, _locator = ''): IMethod {
        const converted: IMethod = {
            type: 'method',
            id: method.id,
            _locator: [_locator, method.id].join('.'),
            name: method.name,
            description: method.description,
            order: method.order,
            approaches: []
        };

        converted.approaches = method.approaches.map(a => APIState.convertApproach(a, converted._locator)).sort(APIState.sortByOrder);

        return converted;
    }

    public static convertApproach(approach: IAPIApproach, _locator = ''): IApproach {
        const converted: IApproach = {
            type: 'approach',
            id: approach.id,
            name: approach.name,
            description: approach.description,
            order: approach.order,
            _locator: [_locator, approach.id].join('.'),
            roles: [approach.accountable, ...approach.responsibles].filter(Boolean).map(APIState.convertRole),
            tasks: [],
            templates: approach.templates?.map(APIState.convertTemplate) ?? [] // TODO: Determine missing reason
        };

        converted.tasks = approach.tasks
            .filter(t => t.name !== null)
            .map(t => APIState.convertTask(t, converted._locator))
            .sort(APIState.sortByOrder);

        return converted;
    }

    public static convertTemplate(template: IAPITemplate): ITemplate {
        return {
            id: template.id,
            name: template.name
        };
    }

    public static convertRole(role: IAPIRole): IRole {
        const name = normalizeName(role.name);

        return determineRoleColor({
            id: role.id,
            name,
            description: role.description,
            skills: role.skills,
            related_jd: role.related_job_description
        });
    }

    public static convertTask(task: IAPITask, _locator = ''): ITask {
        return {
            type: 'task',
            id: task.id,
            name: task.name,
            order: task.order,
            _locator: [_locator, task.id].join('.'),
            responsible: APIState.convertRole(task.responsible),
            purpose: task.purpose,
            how: task.how,
            category: APIState.convertCategory(task.category),
            artefacts: APIState.convertArtefacts(task.artefactsOutput),
            inputArtefacts: APIState.convertArtefacts(task.artefactsInput),
            inputDescription: task.inputDescription,
            outputDescription: task.outputDescription
        };
    }

    public static convertCategory(category: IAPICategory): ICategory {
        return {
            id: category.id,
            name: category.name
        };
    }

    public static convertArtefacts(artefacts: IAPIArtefact[]): IArtefact[] {
        return artefacts?.map<IArtefact>(artefact => {
            return {
                id: artefact.id,
                name: artefact.name.trim(),
                description: artefact.description,
                owner: artefact.owner,
                refNo: artefact.refNo,
                url: {
                    group: artefact.groupArtefact,
                    uk: artefact.ukartefact,
                    de: artefact.deartefact
                }
            } satisfies IArtefact;
        });
    }

    public static convertGlossary(glossary: IAPIGlossary): IGlossary {
        return {
            id: glossary.id,
            grouping: glossary.grouping,
            title: glossary.titleTranslation.trim(),
            definition: glossary.definitionTranslation
        } satisfies IGlossary;
    }

    public static convertFaq(faq: IAPIFaq): IFaq {
        return {
            id: faq.id,
            order: faq.questionRef,
            question: faq.titleTranslation,
            answer: faq.answerTranslation
        } satisfies IFaq;
    }

    constructor(private readonly _http: HttpClient) {}

    @Action(APIFramework.FetchTree)
    fetchDataTree({ patchState }: StateContext<IAPIState>): void {
        patchState({ treeFetching: true }); // Mark state requesting status

        const response = this._http
            .post<IAPIPhase[]>(`${environment.apiConfig.uri}/v1/Phases/GetPhases`, {
                responseType: 'json',
                context: new HttpContext()
                    // .set(CacheStorage, CacheType.FULL_FRAMEWORK)
                    // .set(CachePolicy, CachingPolicy.STALE_WHILE_REVALIDATE)
                    .set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('tree')));

        response.subscribe(rawPhases => {
            // Convert IAPIPhase to IPhase
            const phases = (rawPhases as IAPIPhase[]).map(APIState.convertPhase).sort(APIState.sortByOrder);

            // Persist newly fetched data in state
            patchState({ phases, treeFetched: true, treeFetching: false });
        });
    }

    @Action(APIGlossary.List)
    fetchGlossary({ patchState }: StateContext<IAPIState>): void {
        const response = this._http
            .post<IAPIPhase[]>(`${environment.apiConfig.uri}/v1/Phases/GetGlossary`, {
                responseType: 'json',
                context: new HttpContext()
                    // .set(CacheStorage, CacheType.GLOSSARY)
                    // .set(CachePolicy, CachingPolicy.STALE_WHILE_REVALIDATE)
                    .set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('glossary')));

        response.subscribe(rawGlossary => {
            const glossary = (rawGlossary as IAPIGlossary[]).map(APIState.convertGlossary).sort((g1: IGlossary, g2: IGlossary) => {
                const c1 = g1.grouping;
                const c2 = g2.grouping;

                if (c1 < c2) {
                    return -1;
                } else if (c1 > c2) {
                    return 1;
                }

                return 0;
            });

            // Persist newly fetched data in state
            patchState({ glossary });
        });
    }

    @Action(APIFaq.List)
    fetchFaq({ patchState }: StateContext<IAPIState>): void {
        const response = this._http
            .post<IAPIPhase[]>(`${environment.apiConfig.uri}/v1/Phases/GetFaq`, {
                responseType: 'json',
                context: new HttpContext()
                    // .set(CacheStorage, CacheType.GLOSSARY)
                    // .set(CachePolicy, CachingPolicy.STALE_WHILE_REVALIDATE)
                    .set(AuthenticatedRequest, true)
            })
            .pipe(catchError(this.handleError('faq')));

        response.subscribe(rawFaq => {
            const faq = (rawFaq as IAPIFaq[]).map(APIState.convertFaq).sort((f1: IFaq, f2: IFaq) => {
                const c1 = f1.question;
                const c2 = f2.question;

                if (c1 < c2) {
                    return -1;
                } else if (c1 > c2) {
                    return 1;
                }

                return 0;
            });

            // Persist newly fetched data in state
            patchState({ faq });
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
                if (environment.mock.tree) {
                    return from((async () => (await import('./mock-phases')).phases as unknown as T)());
                } else {
                    return of([] as T);
                }
            } else if (operation === 'glossary') {
                if (environment.mock.glossary) {
                    return from((async () => (await import('./mock-glossary')).glossary as unknown as T)());
                } else {
                    return of([] as T);
                }
            } else if (operation === 'faq') {
                if (environment.mock.faq) {
                    return from((async () => (await import('./mock-faq')).faq as unknown as T)());
                } else {
                    return of([] as T);
                }
            } else {
                return of(null as T);
            }
        };
    }
}
