import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ISVGRenderingOptions, SVGNode } from '@teq/shared/types/svg.type';
import { SVGNodeRendererComponent } from '../svg-element/svg-element.component';

@Component({
    selector: 'teq-svg',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, SVGNodeRendererComponent],
    templateUrl: './svg.component.svg',
    styleUrls: ['./svg.component.scss']
})
export class SVGRendererComponent {
    @Input() options!: ISVGRenderingOptions | null;

    get width(): number {
        return this.options?.width ?? 0;
    }

    get height(): number {
        return this.options?.height ?? 0;
    }

    get content(): SVGNode[] {
        return this.options?.contents ?? [];
    }

    get viewBox(): string {
        return `0 0 ${this.width} ${this.height}`;
    }
}
