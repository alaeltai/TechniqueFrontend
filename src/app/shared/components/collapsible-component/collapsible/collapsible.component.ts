import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../../icon/icon.component';
import { EntityCollapseComponent } from '../../entity-collapse/entity-collapse.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

@Component({
    selector: 'teq-collapsible',
    standalone: true,
    imports: [NgIf, IconComponent, EntityCollapseComponent, HighlighterPipe],
    templateUrl: './collapsible.component.html',
    styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent {
    public isExpanded = false;

    @Input() title!: string;
    @Input() content!: string;
    @Input() term!: string;
    @Input() url?: {
        uk?: string;
        de?: string;
    };

    toggleContent(): void {
        this.isExpanded = !this.isExpanded;
    }
}
