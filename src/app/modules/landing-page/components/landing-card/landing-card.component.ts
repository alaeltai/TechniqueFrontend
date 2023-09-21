import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';

@Component({
    selector: 'teq-landing-card',
    templateUrl: './landing-card.component.html',
    styleUrls: ['./landing-card.component.scss']
})
export class LandingCardComponent {
    @Input() card!: ILandingCard;

    constructor(public readonly router: Router) {}
}
