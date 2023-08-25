import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IMethod } from '@teq/shared/types/method.type';
import { ApproachComponent } from '../approach/approach.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { EntityCollapseComponent } from '@teq/shared/components/entity-collapse/entity-collapse.component';

@Component({
    selector: 'teq-method',
    standalone: true,
    imports: [NgIf, NgFor, IconComponent, ApproachComponent, ToggleComponent, EntityCollapseComponent, CommonModule],
    templateUrl: './method.component.html',
    styleUrls: ['./method.component.scss']
})
export class MethodComponent {
    @Input() method!: IMethod;
    @Input() disabled?: boolean;
    @Input() disableable?: boolean;
    @Input() filterDisabled?: boolean;

    @HostBinding('attr.data-disabled')
    get disabledHost(): boolean {
        return this.disabled ?? this.method?.disabled ?? false;
    }

    @HostBinding('attr.data-collapsed')
    get collapsedApproach(): boolean {
        return (this.method?.collapsed as boolean) ?? true;
    }

    constructor(private readonly _filtersService: FiltersService) {}

    toggleDisableState(): void {
        const disabled = !this.method.disabled;

        this._filtersService.enforceDisabledStatusAtLocation(this.method, disabled);
    }

    toggleCollapseState(): void {
        const collapsed = !this.method.collapsed;

        this._filtersService.ensureCollapsedStatusAtLocation(this.method, collapsed);
    }
}
