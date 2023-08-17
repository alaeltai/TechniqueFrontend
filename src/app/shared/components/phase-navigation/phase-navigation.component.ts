import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'teq-phase-navigation',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle],
    templateUrl: './phase-navigation.component.html',
    styleUrls: ['./phase-navigation.component.scss']
})
export class PhaseNavigationComponent {}
