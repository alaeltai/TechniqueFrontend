import { Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
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

    @Input()
    @HostBinding('attr.data-size')
    size: 'small' | 'normal' | 'large' = 'normal';

    private opened = false;

    @HostListener('document:click', ['$event'])
    unfocus(event: Event): void {
        if (!this.opened) {
            this.opened = true;

            return;
        }

        let found = false;

        if (event.target) {
            let target: HTMLElement | null = event.target as HTMLElement;

            while (target) {
                if (target === this._element.nativeElement) {
                    // Inside the container
                    found = true;
                    break;
                }

                target = target.parentElement;
            }
        }

        if (!found) {
            this.close();
        }
    }

    constructor(private readonly _overlayService: OverlayService, private readonly _element: ElementRef<HTMLElement>) {}

    close(): void {
        this._overlayService.remove(this.registrationId);

        this.opened = false;
    }
}
