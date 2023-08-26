import { Component, Input } from '@angular/core';

@Component({
    selector: 'teq-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
    public numbers: number[];

    @Input() progress?: number;
    @Input() fileName?: string;

    constructor() {
        this.numbers = Array(100)
            .fill(0)
            .map((_, i) => i + 1);
    }
}
