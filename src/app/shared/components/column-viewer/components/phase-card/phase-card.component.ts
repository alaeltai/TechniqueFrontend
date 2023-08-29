import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { IPhase } from '@teq/shared/types/phase.type';
import { IRole } from '@teq/shared/types/roles.type';
import { RolesContainerComponent } from '../roles-container/roles-container.component';
import { SubphaseTabComponent } from '../subphase-tab/subphase-tab.component';
import { CommonModule } from '@angular/common';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

export interface IRoleCount {
    count: number;
    role: IRole;
}

@Component({
    selector: 'teq-phase-card',
    standalone: true,
    imports: [CommonModule, InformationProviderComponent, ToggleComponent, RolesContainerComponent, SubphaseTabComponent, HighlighterPipe],
    templateUrl: './phase-card.component.html',
    styleUrls: ['./phase-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseCardComponent implements OnChanges {
    public term = this._filtersService.term();
    private _methodsCount = 0;
    private _approachesCount = 0;
    private _roles: IRoleCount[] = [];

    hover = false;

    @Input() phase!: IPhase;

    @Input() methods!: number;
    @Input() approaches!: number;

    @Input() disableable?: boolean;

    constructor(private readonly _filtersService: FiltersService) {}

    get methodsCount(): number {
        return this._methodsCount;
    }

    get methodsCountAll(): number {
        return this.methods ?? 0;
    }

    get approachesCount(): number {
        return this._approachesCount;
    }

    get approachesCountAll(): number {
        return this.approaches ?? 0;
    }

    get roles(): IRoleCount[] {
        return this._roles;
    }

    get image(): string {
        return `assets/img/phases/${this.phase.name.toLocaleLowerCase()}.svg`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('phase' in changes) {
            const phase = changes['phase'].currentValue as IPhase;

            if (phase) {
                let enabledMethods = 0;
                let enabledApproaches = 0;
                const roles: IRoleCount[] = [];
                const rolesMap: Record<IRole['id'], IRole> = {};
                const rolesCount: Record<IRole['id'], number> = {};

                phase.subphases?.forEach(s => {
                    s.methods.forEach(m => {
                        if (!(m.disabled ?? m.filtered)) {
                            enabledMethods += 1;
                        }

                        m.approaches.forEach(a => {
                            if (!(a.disabled ?? a.filtered)) {
                                enabledApproaches += 1;
                            }

                            a.roles.forEach(r => this._agregateRole(r, rolesMap, rolesCount));

                            a.tasks.forEach(t => this._agregateRole(t.responsible, rolesMap, rolesCount));
                        });
                    });
                });

                Object.keys(rolesMap).forEach(id => {
                    roles.push({
                        count: rolesCount[id],
                        role: rolesMap[id]
                    });
                });

                this._methodsCount = enabledMethods;
                this._approachesCount = enabledApproaches;
                this._roles = roles.sort((a, b) => {
                    if (a.role.name.length < b.role.name.length) {
                        return -1;
                    } else if (a.role.name.length > b.role.name.length) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    }

    toggleDisableState(): void {
        const disabled = !this.phase.disabled;

        this._filtersService.enforceDisabledStatusAtLocation(this.phase, disabled);
    }

    private _agregateRole(r: IRole, rolesMap: Record<IRole['id'], IRole>, rolesCount: Record<IRole['id'], number>): void {
        rolesMap[r.id] = r;
        rolesCount[r.id] = (rolesCount[r.id] ?? 0) + 1;
    }
}
