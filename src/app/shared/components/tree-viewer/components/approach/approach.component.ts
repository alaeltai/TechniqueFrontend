import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { IApproach } from '@teq/shared/types/approach.type';
import { TaskComponent } from '../task/task.component';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { ExpandCollapseButtonComponent } from '@teq/shared/components/expand-collapse-button/expand-collapse-button.component';
import { EntityCollapseComponent } from '@teq/shared/components/entity-collapse/entity-collapse.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';
import { SearchEllipseNotificationComponent } from '@teq/shared/components/search-ellipse-notification/search-ellipse-notification.component';
@Component({
    selector: 'teq-approach',
    standalone: true,
    templateUrl: './approach.component.html',
    imports: [
        NgIf,
        NgFor,
        LabelComponent,
        TaskComponent,
        InformationProviderComponent,
        ToggleComponent,
        EntityCollapseComponent,
        ExpandCollapseButtonComponent,
        HighlighterPipe,
        SearchEllipseNotificationComponent
    ],
    styleUrls: ['./approach.component.scss']
})
export class ApproachComponent {
    @Input() term!: string;
    @Input() approach!: IApproach;
    @Input() disabled?: boolean;
    @Input() disableable?: boolean;

    @HostBinding('attr.data-disabled')
    get disabledHost(): boolean {
        return this.disabled ?? this.approach?.disabled ?? false;
    }

    @HostBinding('attr.data-collapsed')
    get collapsedApproach(): boolean {
        return (this.approach?.collapsed as boolean) ?? false;
    }

    constructor(private readonly _filtersService: FiltersService) {}

    toggleDisableState(): void {
        const disabled = !this.approach.disabled;

        this._filtersService.enforceDisabledStatusAtLocation(this.approach, disabled);
    }

    toggleCollapseState(): void {
        const collapsed = !this.approach.collapsed;

        this._filtersService.ensureCollapsedStatusAtLocation(this.approach, collapsed);
    }
}
