import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import type { SVGNode } from '@teq/shared/types/svg.type';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[svg-element-renderer]',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './svg-element.component.svg',
    styleUrls: ['./svg-element.component.scss']
})
export class SVGNodeRendererComponent {
    @Input() options!: SVGNode;
}
