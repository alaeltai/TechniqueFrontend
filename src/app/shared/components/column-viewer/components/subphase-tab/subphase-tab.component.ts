import { Component, Input } from '@angular/core';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';
import { ISubphase } from '@teq/shared/types/subphase.type';

@Component({
    selector: 'teq-subphase-tab',
    standalone: true,
    imports: [InformationProviderComponent, HighlighterPipe],
    templateUrl: './subphase-tab.component.html',
    styleUrls: ['./subphase-tab.component.scss']
})
export class SubphaseTabComponent {
    @Input() subphase!: ISubphase;
    @Input() color?: string;
    @Input() term!: string;
}
