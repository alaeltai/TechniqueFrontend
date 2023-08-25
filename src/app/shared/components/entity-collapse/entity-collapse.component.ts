import { Component, Input, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'teq-entity-collapse',
    standalone: true,
    templateUrl: './entity-collapse.component.html',
    styleUrls: ['./entity-collapse.component.scss'],
    animations: [
        trigger('collapse', [
            state('0', style({ height: '*', opacity: '1' })),
            state('1', style({ height: '0', opacity: '0' })),
            transition('1 <=> 0', animate('{{duration}}ms {{easing}}'), {
                params: {
                    duration: 500,
                    easing: 'ease-in-out'
                }
            })
        ])
    ]
})
export class EntityCollapseComponent {
    @HostBinding('@collapse')
    @Input()
    collapse!: boolean;
}
