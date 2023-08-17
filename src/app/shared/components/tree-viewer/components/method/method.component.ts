import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMethod } from '@teq/shared/types/method.type';
import { ApproachComponent } from '../approach/approach.component';

@Component({
    selector: 'teq-method',
    standalone: true,
    imports: [NgFor, ApproachComponent],
    templateUrl: './method.component.html',
    styleUrls: ['./method.component.scss']
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MethodComponent {
    @Input() method?: IMethod;
}
