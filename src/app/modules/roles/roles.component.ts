/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { IListItem } from '@teq/shared/components/side-list/side-list.component';
import { ITab } from '@teq/shared/components/tabs/tabs.component';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
import { IApproach } from '@teq/shared/types/approach.type';
import { ICategory } from '@teq/shared/types/category.type';
import { IMethod } from '@teq/shared/types/method.type';
import { IPhase } from '@teq/shared/types/phase.type';
import { IRole } from '@teq/shared/types/roles.type';
import { ISubphase } from '@teq/shared/types/subphase.type';
import { ITask } from '@teq/shared/types/task.type';

type RowTupple = [IMethod, IApproach, ICategory, ITask];

type SortDirection = 'ascending' | 'descending' | 'unsorted';

interface IRoleAggregation {
    id: string;
    role: IRole;
    phases: IPhase[];
    subphases: ISubphase[];
    rows: RowTupple[];
}

interface ITableHeader {
    name: string;
    sortDirection: string;
}

type IRolesAggregation = Record<string, IRoleAggregation>;

@UntilDestroy()
@Component({
    selector: 'teq-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    animations: [fadeIn]
})
export class RolesComponent extends TreeBasedPageComponent implements OnInit {
    public readonly phases$ = this._apiService.phases$;

    public tableHeaders: ITableHeader[] = [
        { name: 'Method', sortDirection: 'unsorted' },
        { name: 'Approach', sortDirection: 'unsorted' },
        { name: 'Category', sortDirection: 'unsorted' },
        { name: 'Task', sortDirection: 'unsorted' }
    ];

    public rolesList: IRoleAggregation[] = [];

    public selected = '';

    public tabs!: ITab[];

    private _aggregatedRoles: IRolesAggregation = {};

    private _computedItems: IListItem[] | null = null;

    get currentAggregation(): IRoleAggregation {
        const currentAggregation = this._aggregatedRoles[this.selected];
        if (currentAggregation) {
            this.tabs = this.parseTabs(currentAggregation.role);
        }
        return currentAggregation;
    }

    override ngOnInit(): void {
        super.ngOnInit();

        const rolesMap: IRolesAggregation = {};

        this.phases$.pipe(untilDestroyed(this)).subscribe(phases => {
            phases.forEach(p => {
                p.subphases?.forEach(s => {
                    s.methods.forEach(m => {
                        m.approaches.forEach(a => {
                            const roles = a.roles;

                            roles.forEach(r => {
                                rolesMap[r.id] = rolesMap[r.id] || {
                                    id: r.id,
                                    role: r,
                                    phases: [],
                                    subphases: [],
                                    rows: []
                                };

                                rolesMap[r.id].phases.push(p);
                                rolesMap[r.id].subphases.push(s);
                            });

                            a.tasks.forEach(t => {
                                const r = t.responsible;

                                rolesMap[r.id].rows.push([m, a, t.category, t]);
                            });
                        });
                    });
                });
            });

            this.rolesList = Object.keys(rolesMap).map(roleId => {
                if (!this.selected) {
                    this.selected = roleId;
                }

                const role = rolesMap[roleId];
                role.phases = Array.from(new Set(role.phases));
                role.subphases = Array.from(new Set(role.subphases));

                return role;
            });

            this._aggregatedRoles = rolesMap;

            this._computedItems = this.rolesList.map(r => ({ value: r.id, label: r.role.name }));
        });
    }

    selectionChanged(selected: string): void {
        this.selected = selected;
    }

    parseTabs(role: IRole): ITab[] {
        return [
            {
                title: 'Description',
                content: role.description || 'No specific data'
            },
            {
                title: 'Skills and qualifications',
                content: role.skills || 'No specific data'
            },
            {
                title: 'Related job descriptions',
                content: role.related_jd || 'No specific data'
            }
        ];
    }

    get computedItems(): IListItem[] {
        return this._computedItems ?? ([] as IListItem[]);
    }

    sort(index: number): void {
        this.currentAggregation.rows.sort((a, b) => {
            const direction = this.getSortDirection(index);

            if (direction === 'unsorted' || direction === 'descending') {
                this.setColumnDirection(index, 'ascending');
                return a[index].name.localeCompare(b[index].name);
            } else {
                this.setColumnDirection(index, 'descending');
                return b[index].name.localeCompare(a[index].name);
            }
        });
    }

    setColumnDirection(index: number, direction: string): void {
        this.tableHeaders.forEach((h, i) => {
            if (index === i) {
                this.tableHeaders[i].sortDirection = direction;
                return;
            }
            this.tableHeaders[i].sortDirection = 'unsorted';
        });
    }

    getSortDirection(index: number): SortDirection {
        const arr = this.currentAggregation.rows;
        const c = [];

        for (let i = 1; i < arr.length; i++) {
            c.push(arr[i - 1][index].name.localeCompare(arr[i][index]?.name));
        }

        if (c.every(n => n <= 0)) return 'ascending';
        if (c.every(n => n >= 0)) return 'descending';

        return 'unsorted';
    }
}
