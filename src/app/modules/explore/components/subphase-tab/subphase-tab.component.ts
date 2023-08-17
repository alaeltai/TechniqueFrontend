import { Component, Input } from '@angular/core';
import { ISubphase } from '@teq/shared/types/subphase.type';

@Component({
    selector: 'teq-subphase-tab',
    templateUrl: './subphase-tab.component.html',
    styleUrls: ['./subphase-tab.component.scss']
})
export class SubphaseTabComponent {
    @Input() subphase!: ISubphase;
    @Input() color?: string;
}
