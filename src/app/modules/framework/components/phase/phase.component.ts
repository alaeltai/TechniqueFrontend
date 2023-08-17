import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import type { IPhase } from '@teq/shared/types/phase.type';

@Component({
    selector: 'teq-phase',
    templateUrl: './phase.component.html',
    styleUrls: ['./phase.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseComponent {
    private _phase!: IPhase;

    @Input() set phase(value: IPhase) {
        this._phase = value;
        this._hostElem.nativeElement.classList.add(this._phase.name.toLocaleLowerCase());
    }

    get phase(): IPhase {
        return this._phase;
    }

    constructor(private readonly _hostElem: ElementRef<HTMLElement>) {}
}
