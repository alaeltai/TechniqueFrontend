import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IApproach } from '@teq/shared/types/approach.type';

@Component({
    selector: 'teq-approach',
    templateUrl: './approach.component.html',
    styleUrls: ['./approach.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproachComponent {
    @Input() approach?: IApproach;
}
