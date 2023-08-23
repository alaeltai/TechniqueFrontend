import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IMethod } from '@teq/shared/types/method.type';
import { ApproachComponent } from '../approach/approach.component';
import { enforceDisabledStatusAtLocation } from '@teq/shared/lib/disable.lib';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';

@Component({
    selector: 'teq-method',
    standalone: true,
    imports: [NgIf, NgFor, ApproachComponent, ToggleComponent],
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

    toggleDisableState(): void {
        const disabled = !this.method.disabled;

        enforceDisabledStatusAtLocation(this.method, disabled);
    }
}
