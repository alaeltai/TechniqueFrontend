import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LandingPageControllerService } from '@teq/modules/landing-page/state/landing-page-controller.service';
import { LoadLandingCards, LoadLandingCardsError, LoadLandingCardsSuccess } from '@teq/modules/landing-page/state/landing-page.actions';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';

export class ILandingPageState {
    cards!: ILandingCard[];
}

const initialLandingPageState: ILandingPageState = {
    cards: []
};

@State<ILandingPageState>({
    name: 'landingPage',
    defaults: initialLandingPageState
})
@Injectable()
export class LandingPageState {
    constructor(private readonly _landingPageControllerService: LandingPageControllerService) {}

    @Selector()
    static cards(state: ILandingPageState): ILandingCard[] {
        return state.cards;
    }

    @Action(LoadLandingCards)
    loadLandingCards({ dispatch }: StateContext<ILandingPageState>): void {
        this._landingPageControllerService
            .getLandingPageCards()
            .pipe(take(1))
            .subscribe(cards => {
                dispatch(new LoadLandingCardsSuccess(cards));
            });
    }

    @Action(LoadLandingCardsSuccess)
    loadLandingCardsSuccess({ patchState }: StateContext<ILandingPageState>, cards: LoadLandingCardsSuccess): void {
        patchState(cards);
    }

    @Action(LoadLandingCardsError)
    loadLandingCardsError({ patchState }: StateContext<ILandingPageState>): void {
        patchState({
            cards: []
        });
    }
}
