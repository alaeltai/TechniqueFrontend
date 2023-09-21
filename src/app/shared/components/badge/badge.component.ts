import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'teq-badge',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
    @Input() color?: string;
    @Input() backgroundColor?: string;
}
