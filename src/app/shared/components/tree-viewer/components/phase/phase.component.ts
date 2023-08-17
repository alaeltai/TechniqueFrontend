import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import type { IPhase } from '@teq/shared/types/phase.type';
import { SubphaseComponent } from '../subphase/subphase.component';
import { MethodComponent } from '../method/method.component';
import { NgFor, NgIf } from '@angular/common';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { IconComponent } from '@teq/shared/components/icon/icon.component';

@Component({
    selector: 'teq-phase',
    standalone: true,
    imports: [NgIf, NgFor, SubphaseComponent, MethodComponent, InformationProviderComponent, IconComponent],
    templateUrl: './phase.component.html',
    styleUrls: ['./phase.component.scss']
})
export class PhaseComponent {
    private _phase!: IPhase;

    @Input() set phase(value: IPhase) {
        this._phase = value;
    }

    get phase(): IPhase {
        return this._phase;
    }

    @Input() showArrow?: boolean;

    @Output() phaseClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(private readonly _hostElem: ElementRef<HTMLElement>) {}
}
