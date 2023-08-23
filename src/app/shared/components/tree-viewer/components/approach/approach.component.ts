import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { IApproach } from '@teq/shared/types/approach.type';
import { TaskComponent } from '../task/task.component';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { enforceDisabledStatusAtLocation } from '@teq/shared/lib/disable.lib';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';

@Component({
    selector: 'teq-approach',
    standalone: true,
    templateUrl: './approach.component.html',
    imports: [NgIf, NgFor, LabelComponent, TaskComponent, InformationProviderComponent, ToggleComponent],
    styleUrls: ['./approach.component.scss']
})
export class ApproachComponent {
    @Input() approach!: IApproach;
    @Input() disabled?: boolean;
    @Input() disableable?: boolean;

    @HostBinding('attr.data-disabled')
    get disabledHost(): boolean {
        return this.disabled ?? this.approach?.disabled ?? false;
    }

    toggleDisableState(): void {
        const disabled = !this.approach.disabled;

        enforceDisabledStatusAtLocation(this.approach, disabled);
    }
}
