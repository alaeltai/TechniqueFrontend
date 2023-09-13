import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';

@Component({
    selector: 'teq-template-card',
    templateUrl: './template-card.component.html',
    styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent {
    @Input() template!: ITemplateCard;

    constructor(public readonly router: Router) {}
}
