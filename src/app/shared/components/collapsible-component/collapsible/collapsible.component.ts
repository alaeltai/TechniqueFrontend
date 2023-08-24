import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../../icon/icon.component';

@Component({
    selector: 'teq-collapsible',
    standalone: true,
    imports: [NgIf, IconComponent],
    templateUrl: './collapsible.component.html',
    styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent {
    @Input() title!: string;
    @Input() content!: string;
    @Input() url?: {
        uk?: string;
        de?: string;
    };
    public isExpanded = false;

    toggleContent() {
        this.isExpanded = !this.isExpanded;
    }
}
