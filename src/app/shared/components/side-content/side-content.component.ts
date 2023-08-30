import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

@Component({
    selector: 'teq-side-content',
    standalone: true,
    imports: [CommonModule, HighlighterPipe],
    templateUrl: './side-content.component.html',
    styleUrls: ['./side-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideContentComponent {
    @Input() content!: string;

    @Input() term!: string;
}
