import { Injectable } from '@angular/core';
import { IFilters } from '@teq/shared/components/filters/types/filters.type';
import { Observable, Subject, of, take } from 'rxjs';
import { APIService } from '../../states/api/api.service';
import { IPhase } from '@teq/shared/types/phase.type';
import { IRole } from '@teq/shared/types/roles.type';

export const filters: IFilters = {
    toggles: [
        {
            value: false,
            label: 'Hide disabled'
        },
        {
            value: false,
            label: 'Show disable/enable toggles'
        }
    ],
    selects: [
        {
            label: 'Complexity',
            controlName: 'complexity',
            options: [
                {
                    value: 0,
                    label: 'All complexities'
                },
                {
                    value: 1,
                    label: 'Low complexity'
                },
                {
                    value: 2,
                    label: 'Medium complexity'
                },
                {
                    value: 3,
                    label: 'Height complexity'
                }
            ]
        },

        {
            label: 'Roles',
            controlName: 'role',
            searchable: true,
            options: [
                {
                    value: 0,
                    label: 'All Roles'
                },
                {
                    value: 1,
                    label: 'Account Team'
                },
                {
                    value: 2,
                    label: 'Bid Manager'
                },
                {
                    value: 3,
                    label: 'Consultant (Business)'
                },
                {
                    value: 4,
                    label: 'Consultant (Change)'
                },
                {
                    value: 5,
                    label: 'Consultant (Innovation)'
                },
                {
                    value: 6,
                    label: 'Consultant (Testing)'
                },
                {
                    value: 7,
                    label: 'Opportunity Owner'
                },
                {
                    value: 8,
                    label: 'Project Lead'
                },
                {
                    value: 9,
                    label: 'Service Manager'
                },
                {
                    value: 10,
                    label: 'Solution Architect'
                },
                {
                    value: 11,
                    label: 'Solution Lead'
                },
                {
                    value: 12,
                    label: 'Manager'
                }
            ]
        },
        {
            label: 'Category',
            controlName: 'category',
            options: [
                {
                    value: 0,
                    label: 'VA & QC'
                },
                {
                    value: 1,
                    label: 'VA'
                },
                {
                    value: 2,
                    label: 'QC'
                }
            ]
        }
    ]
};

export enum FilterType {
    ToggleFilterDisabled,
    ToggleDisableControl,
    SelectComplexity,
    SelectRoles,
    SelectCategory,
    Search
}

@Injectable()
export class FiltersService {
    private _originalPhases!: IPhase[];
    private readonly _filters: IFilters = {
        toggles: [],
        selects: []
    };

    public phases$: Subject<IPhase[]> = new Subject<IPhase[]>();

    constructor(private readonly _apiService: APIService) {
        this._apiService.phases$.pipe(take(1)).subscribe(phases => {
            this._originalPhases = phases;

            this._filter();
        });
    }

    private _filter(): IPhase[] {
        return this._originalPhases.map(p => p);
    }

    public addFilter(type: FilterType): void {
        switch (type) {
            case FilterType.ToggleFilterDisabled:
                this._filters.toggles.push({
                    value: false,
                    label: 'Hide disabled'
                });
                break;

            case FilterType.ToggleDisableControl:
                this._filters.toggles.push({
                    value: false,
                    label: 'Show disable/enable toggles'
                });
                break;

            case FilterType.SelectComplexity:
                this._filters.selects.push({
                    label: 'Complexity',
                    controlName: 'complexity',
                    options: [
                        {
                            value: -1,
                            label: 'All complexities'
                        }
                        // TODO: Extract from approach.templates
                    ]
                });
                break;

            case FilterType.SelectRoles:
                this._filters.selects.push({
                    label: 'Roles',
                    controlName: 'role',
                    searchable: true,
                    options: [
                        {
                            value: -1,
                            label: 'All Roles'
                        },
                        ...this._extractRoles().map(r => ({
                            value: r.id,
                            label: r.name
                        }))
                    ]
                });
                break;

            default:
                break;
        }
    }

    private _extractRoles(): IRole[] {
        const rolesMap: Record<IRole['id'], IRole> = {};
        const rolesCount: Record<IRole['id'], number> = {};
        this._originalPhases.forEach(phase => {
            phase.subphases?.forEach(s => {
                s.methods.forEach(m => {
                    m.approaches.forEach(a => {
                        a.roles.forEach(r => this._agregateRole(r, rolesMap, rolesCount));

                        a.tasks.forEach(t => this._agregateRole(t.responsible, rolesMap, rolesCount));
                    });
                });
            });
        });

        return Object.keys(rolesMap).map(id => rolesMap[id]);
    }

    private _agregateRole(r: IRole, rolesMap: Record<IRole['id'], IRole>, rolesCount: Record<IRole['id'], number>): void {
        rolesMap[r.id] = r;
        rolesCount[r.id] = (rolesCount[r.id] ?? 0) + 1;
    }

    getFilters(): Observable<IFilters> {
        return of(filters);
    }
}
