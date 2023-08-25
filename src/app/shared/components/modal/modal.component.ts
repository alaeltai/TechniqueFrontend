import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { OverlayService } from '../../services/overlay.service';
import { IconComponent } from '../icon/icon.component';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

@Component({
    selector: 'teq-modal',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, IconComponent, HighlighterPipe],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() title!: string;
    @Input() registrationId!: number;
    @Input() term!: string;

    constructor(private readonly _overlayService: OverlayService) {}

    close(): void {
        this._overlayService.remove(this.registrationId);
    }
}
