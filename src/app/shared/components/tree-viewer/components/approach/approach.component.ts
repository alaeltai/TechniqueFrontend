import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { IApproach } from '@teq/shared/types/approach.type';
import { TaskComponent } from '../task/task.component';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';

@Component({
    selector: 'teq-approach',
    standalone: true,
    templateUrl: './approach.component.html',
    imports: [NgFor, LabelComponent, TaskComponent, InformationProviderComponent],
    styleUrls: ['./approach.component.scss']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproachComponent {
    @Input() approach!: IApproach;
}
