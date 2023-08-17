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

    @Input() type!: 'caret' | 'minus' | 'plus' | 'information' | 'arrow';

    get caretOrientation(): CaretOrientation {
        return this.orientation ?? 'left';
    }

    get iconDimensions(): IconDimensions {
        switch (this.type) {
            case 'caret':
                return this.asDimensions(6, 8);

            case 'minus':
                return this.asDimensions(12, 2);

            case 'plus':
                return this.asDimensions(12, 12);

            case 'information':
                return this.asDimensions(20, 20);

            case 'arrow':
                return this.asDimensions(19, 8);
        }
    }

    private asDimensions(width: number, height: number): IconDimensions {
        return { width, height, viewBox: `0 0 ${width} ${height}` };
    }
}
