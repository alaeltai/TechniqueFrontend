import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { BadgeComponent } from '@teq/shared/components/badge/badge.component';

@Component({
    selector: 'teq-label',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, BadgeComponent],
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss']
})
export class LabelComponent {
    @Input() bold?: boolean;
    @Input() color?: string;
    @Input() borderColor?: string;
    @Input() inverse?: boolean;
}
