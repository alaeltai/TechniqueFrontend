import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { IPhase } from '@teq/shared/types/phase.type';
import { SubphaseComponent } from '../subphase/subphase.component';
import { MethodComponent } from '../method/method.component';
import { NgFor, NgIf } from '@angular/common';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

@Component({
    selector: 'teq-phase',
    standalone: true,
    imports: [NgIf, NgFor, SubphaseComponent, MethodComponent, InformationProviderComponent, IconComponent, ToggleComponent, HighlighterPipe],
    templateUrl: './phase.component.html',
    styleUrls: ['./phase.component.scss']
})
export class PhaseComponent {
    public term = this._filtersService.term();

    @Input() phase!: IPhase;

    @Input() disabled?: boolean;
    @Input() disableable?: boolean;

    @Input() showArrow?: boolean;

    @Output() phaseClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(private readonly _filtersService: FiltersService) {}

    toggleDisableState(): void {
        const disabled = !this.phase.disabled;

        this._filtersService.enforceDisabledStatusAtLocation(this.phase, disabled);
    }
}
