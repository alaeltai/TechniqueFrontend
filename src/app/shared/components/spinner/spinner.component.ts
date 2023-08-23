import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'teq-spinner',
    standalone: true,
    imports: [NgIf],
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {}
