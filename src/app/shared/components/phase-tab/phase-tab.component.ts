import { Component, Input } from '@angular/core';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';
import { IPhase } from '@teq/shared/types/phase.type';

@Component({
    selector: 'teq-phase-tab',
    standalone: true,
    imports: [InformationProviderComponent, HighlighterPipe],
    templateUrl: './phase-tab.component.html',
    styleUrls: ['./phase-tab.component.scss']
})
export class PhaseTabComponent {
    @Input() phase!: IPhase;
    @Input() term!: string;
}
