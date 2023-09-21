import { HttpErrorResponse } from '@angular/common/http';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';

export class LoadTemplateCards {
    static readonly type = '[Select template] Load cards';
}

export class LoadTemplateCardsSuccess {
    static readonly type = '[Select template] Load cards success';
    constructor(public cards: ITemplateCard[]) {}
}

export class LoadTemplateCardsError {
    static readonly type = '[Select template] Load cards error';
    constructor(public error: HttpErrorResponse) {}
}
