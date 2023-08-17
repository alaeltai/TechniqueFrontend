import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { ISubphase } from '@teq/shared/types/subphase.type';

@Component({
    selector: 'teq-subphase',
    standalone: true,
    templateUrl: './subphase.component.html',
    styleUrls: ['./subphase.component.scss'],
    imports: [InformationProviderComponent]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubphaseComponent {
    @Input() subphase!: ISubphase;
}
