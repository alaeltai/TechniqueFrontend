import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'teq-color-bar',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './color-bar.component.html',
    styleUrls: ['./color-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorBarComponent {}
