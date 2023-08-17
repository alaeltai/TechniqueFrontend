import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'teq-overlay',
    standalone: true,
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss'],
    imports: [NgIf],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {
    @Input() loading = true;

    @Input()
    @HostBinding('attr.data-active')
    active = true;
}
