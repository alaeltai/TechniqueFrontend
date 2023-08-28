import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
import { IApproach } from '@teq/shared/types/approach.type';
import { ICategory } from '@teq/shared/types/category.type';
import { IMethod } from '@teq/shared/types/method.type';
import { IPhase } from '@teq/shared/types/phase.type';
import { IRole } from '@teq/shared/types/roles.type';
import { ISubphase } from '@teq/shared/types/subphase.type';
import { ITask } from '@teq/shared/types/task.type';

type RowTupple = [IMethod, IApproach, ICategory, ITask];

interface IRoleAggregation {
    id: string;
    role: IRole;
    phases: IPhase[];
    subphases: ISubphase[];
    rows: RowTupple[];
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

    public rolesList: IRoleAggregation[] = [];

    public selected = '';

    private _aggregatedRoles: IRolesAggregation = {};

    get currentAggregation(): IRoleAggregation {
        return this._aggregatedRoles[this.selected];
    }

    override ngOnInit(): void {
        super.ngOnInit();

        const rolesMap: IRolesAggregation = {};

        console.log('in pipe');

        this.phases$.pipe(untilDestroyed(this)).subscribe(phases => {
            phases.forEach(p => {
                p.subphases?.forEach(s => {
                    s.methods.forEach(m => {
                        m.approaches.forEach(a => {
                            a.tasks.forEach(t => {
                                const r = t.responsible;

                                rolesMap[r.id] = rolesMap[r.id] || {
                                    id: r.id,
                                    role: r,
                                    phases: [],
                                    subphases: [],
                                    rows: []
                                };

                                rolesMap[r.id].phases.push(p);
                                rolesMap[r.id].subphases.push(s);
                                rolesMap[r.id].rows.push([m, a, t.category, t]);
                            });
                        });
                    });
                });
            });

            this.rolesList = Object.keys(rolesMap).map(roleId => {
                if (!this.selected) {
                    this.selected = roleId; // TODO: Remove once selecting
                }

                const role = rolesMap[roleId];
                role.phases = Array.from(new Set(role.phases));
                role.subphases = Array.from(new Set(role.subphases));

                return role;
            });

            this._aggregatedRoles = rolesMap;
        });
    }
}
