import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ISubphase } from '@teq/shared/types/subphase.type';

@Component({
    selector: 'teq-subphase',
    templateUrl: './subphase.component.html',
    styleUrls: ['./subphase.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubphaseComponent {
    @Input() subphase?: ISubphase;
}
