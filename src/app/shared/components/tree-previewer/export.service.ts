import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { IAPIApproach } from '@teq/shared/types/api/approach.type';
import type { IAPIArtefact } from '@teq/shared/types/api/artefact.type';
import type { IAPIMethod } from '@teq/shared/types/api/method.type';
import type { IAPIPhase } from '@teq/shared/types/api/phase.type';
import type { IAPIRole } from '@teq/shared/types/api/role.type';
import type { IAPISubPhase } from '@teq/shared/types/api/subphase.type';
import type { IAPITask } from '@teq/shared/types/api/task.type';
import type { IArtefact } from '@teq/shared/types/artefact.type';
import type { IRole } from '@teq/shared/types/roles.type';
import type { APIEntityDataType, EntityDataType } from '@teq/shared/types/types';
import { environment } from 'environments/environment';
import type { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    constructor(private readonly _http: HttpClient) {}

    exportPDF(subtree: EntityDataType[]): Observable<Blob> {
        const data = this._invertSubtree(subtree);

        return this._http.post(`${environment.exportService.url}/getpdf`, data, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/pdf')
        });
    }

    exportSVG(subtree: EntityDataType[]): Observable<Blob> {
        const data = this._invertSubtree(subtree);

        return this._http.post(`${environment.exportService.url}/getsvg`, data, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'image/svg+xml')
        });
    }

    private _invertSubtree(entities: EntityDataType[]): APIEntityDataType[] {
        return entities.map(e => this._invertEntity(e)).filter(Boolean) as APIEntityDataType[];
    }

    private _invertEntity(entity: EntityDataType): Partial<APIEntityDataType> | null {
        const base = {
            id: entity.id,
            name: entity.name,
            order: entity.order as number
        };

        switch (entity.type) {
            case 'phase':
                return {
                    ...base,
                    // description: entity.description as string,
                    subPhases: (entity.subphases ?? []).map(s => this._invertEntity(s)).filter(Boolean) as IAPISubPhase[]
                } satisfies Partial<IAPIPhase>;

            case 'subphase':
                return {
                    ...base,
                    // description: entity.description as string,
                    methods: (entity.methods ?? []).map(m => this._invertEntity(m)).filter(Boolean) as IAPIMethod[]
                } satisfies Partial<IAPISubPhase>;

            case 'method':
                return {
                    ...base,
                    // description: entity.description as string,
                    approaches: (entity.approaches ?? []).map(a => this._invertEntity(a)).filter(Boolean) as IAPIApproach[]
                } satisfies Partial<IAPIMethod>;

            case 'approach':
                return {
                    ...base,
                    accountable: this._invertRole(entity.roles[0]) as IAPIRole,
                    responsibles: entity.roles.slice(1).map(r => this._invertRole(r)) as IAPIRole[],
                    // templates: [],
                    // description: entity.description as string,
                    tasks: (entity.tasks ?? []).map(t => this._invertEntity(t)).filter(Boolean) as IAPITask[]
                } satisfies Partial<IAPIApproach>;

            case 'task':
                return {
                    ...base,
                    responsible: this._invertRole(entity.responsible) as IAPIRole,
                    category: {
                        id: entity.category.id,
                        name: entity.category.name
                    },
                    artefactsOutput: entity.artefacts.map(a => this._invertArtefact(a)) as IAPIArtefact[]
                } satisfies Partial<IAPITask>;
        }

        return null;
    }

    private _invertRole(role: IRole): Partial<IAPIRole> {
        return {
            id: role.id,
            name: role.name
            // description: role.description as string
        };
    }

    private _invertArtefact(artefact: IArtefact): Partial<IAPIArtefact> {
        return {
            id: artefact.id,
            name: artefact.name,
            refNo: artefact.refNo
        };
    }
}
