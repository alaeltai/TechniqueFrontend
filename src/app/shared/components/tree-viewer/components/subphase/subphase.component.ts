import { NgIf } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';
import { ISubphase } from '@teq/shared/types/subphase.type';

@Component({
    selector: 'teq-subphase',
    standalone: true,
    templateUrl: './subphase.component.html',
    styleUrls: ['./subphase.component.scss'],
    imports: [NgIf, InformationProviderComponent, ToggleComponent]
})
export class SubphaseComponent {
    @Input() subphase!: ISubphase;
    @Input() disabled?: boolean;
    @Input() disableable?: boolean;

    @HostBinding('attr.data-disabled')
    get disabledHost(): boolean {
        return this.disabled ?? this.subphase.disabled ?? false;
    }

    constructor(private readonly _filtersService: FiltersService) {}

    toggleDisableState(): void {
        const disabled = !this.subphase.disabled;

        this._filtersService.enforceDisabledStatusAtLocation(this.subphase, disabled);
    }
}
