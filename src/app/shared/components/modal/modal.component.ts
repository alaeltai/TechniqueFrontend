import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { OverlayService } from '../../services/overlay.service';

@Component({
    selector: 'teq-modal',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() title!: string;
    @Input() registrationId!: number;

    constructor(private readonly _overlayService: OverlayService) {}

    close(): void {
        this._overlayService.remove(this.registrationId);
    }
}
