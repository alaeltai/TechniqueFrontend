import { Component, OnInit } from '@angular/core';
import { SelectTemplateService } from '@teq/modules/select-template/state/select-template.service';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';
import { bottomFadeIn, fadeIn } from '@teq/shared/animations/animations.lib';
import { Observable } from 'rxjs';

@Component({
    selector: 'teq-select-template',
    templateUrl: './select-template.component.html',
    styleUrls: ['./select-template.component.scss'],
    animations: [bottomFadeIn, fadeIn]
})
export class SelectTemplateComponent implements OnInit {
    public templates$!: Observable<ITemplateCard[]>;

    constructor(private readonly _selectTemplateService: SelectTemplateService) {}

    ngOnInit(): void {
        this._selectTemplateService.loadTemplateCards();

        this.templates$ = this._selectTemplateService.templates$;
    }
}
