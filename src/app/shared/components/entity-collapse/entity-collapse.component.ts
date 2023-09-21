/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'teq-entity-collapse',
    standalone: true,
    templateUrl: './entity-collapse.component.html',
    styleUrls: ['./entity-collapse.component.scss'],
    animations: [
        trigger('collapse', [
            state('0', style({ height: '0', opacity: '0' })),
            state('1', style({ height: '*', opacity: '1' })),
            transition('0 <=> 1', animate('{{duration}}ms {{easing}}'), {
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

    @HostListener('@collapse.start', ['$event'])
    collapseStart(event: any): void {
        event.element.style.overflow = 'hidden';
    }

    @HostListener('@collapse.done', ['$event'])
    collapseDone(event: any): void {
        if (event.toState === true) {
            event.element.style.overflow = 'initial';
        } else {
            event.element.style.overflow = 'hidden';
        }
    }
}
