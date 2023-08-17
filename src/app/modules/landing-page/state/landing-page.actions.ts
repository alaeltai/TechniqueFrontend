import { HttpErrorResponse } from '@angular/common/http';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';

export class LoadLandingCards {
    static readonly type = '[Landing page] Load cards';
}

export class LoadLandingCardsSuccess {
    static readonly type = '[Landing page] Load cards success';
    constructor(public cards: ILandingCard[]) {}
}

export class LoadLandingCardsError {
    static readonly type = '[Landing page] Load cards error';
    constructor(public error: HttpErrorResponse) {}
}
