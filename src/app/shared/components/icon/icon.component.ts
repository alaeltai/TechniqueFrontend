import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

export type CaretOrientation = 'left' | 'right' | 'top' | 'bottom';
interface IconDimensions {
    width: number;
    height: number;
    viewBox: string;
}

@Component({
    selector: 'teq-icon',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './icon.component.svg',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent {
    @Input() disabled?: boolean;

    @Input() orientation?: CaretOrientation;

    @Input() type!: 'caret' | 'minus' | 'plus' | 'information' | 'arrow' | 'cancel' | 'import' | 'alert' | 'collapse' | 'sort';

    get caretOrientation(): CaretOrientation {
        return this.orientation ?? 'left';
    }

    get iconDimensions(): IconDimensions {
        switch (this.type) {
            case 'caret':
                return this.asDimensions(6, 8);
            // return this.asDimensions(0.375, 0.5);

            case 'minus':
                return this.asDimensions(12, 2);
            // return this.asDimensions(0.75, 0.125);

            case 'plus':
                return this.asDimensions(12, 12);
            // return this.asDimensions(0.75, 0.75);

            case 'information':
                return this.asDimensions(20, 20);
            // return this.asDimensions(1.25, 1.25);

            case 'arrow':
                return this.asDimensions(19, 8);
            // return this.asDimensions(1.1875, 0.5);

            case 'cancel':
                return this.asDimensions(15, 14);
            // return this.asDimensions(0.9375, 0.875);

            case 'import':
                return this.asDimensions(25, 20);
            // return this.asDimensions(1.5625, 1.25);

            case 'alert':
                return this.asDimensions(24, 24);
            // return this.asDimensions(1.5, 1.5);

            case 'collapse':
                return this.asDimensions(8, 6);
            // return this.asDimensions(0.5, 0.375);

            case 'sort':
                return this.asDimensions(8, 12);
            // return this.asDimensions(0.5, 0.75);
        }
    }

    private asDimensions(width: number, height: number): IconDimensions {
        return { width, height, viewBox: `0 0 ${width} ${height}` };
    }
}
