import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IMethod } from '@teq/shared/types/method.type';

@Component({
    selector: 'teq-method',
    templateUrl: './method.component.html',
    styleUrls: ['./method.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MethodComponent {
    @Input() method?: IMethod;
}
