import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoadTemplateCards, LoadTemplateCardsError, LoadTemplateCardsSuccess } from '@teq/modules/select-template/state/select-template.actions';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';
import { SelectTemplateControllerService } from '@teq/modules/select-template/state/select-template-controller.service';

export class ISelectTemplateState {
    cards!: ITemplateCard[];
}

const initialSelectTemplateState: ISelectTemplateState = {
    cards: []
};

@State<ISelectTemplateState>({
    name: 'SelectTemplate',
    defaults: initialSelectTemplateState
})
@Injectable()
export class SelectTemplateState {
    constructor(private readonly _selectTemplateControllerService: SelectTemplateControllerService) {}

    @Selector()
    static cards(state: ISelectTemplateState): ITemplateCard[] {
        return state.cards;
    }

    @Action(LoadTemplateCards)
    loadTemplateCards({ dispatch }: StateContext<ISelectTemplateState>): void {
        this._selectTemplateControllerService
            .getTemplateCards()
            .pipe(take(1))
            .subscribe(templates => {
                dispatch(new LoadTemplateCardsSuccess(templates));
            });
    }

    @Action(LoadTemplateCardsSuccess)
    loadTemplateCardsSuccess({ patchState }: StateContext<ISelectTemplateState>, cards: LoadTemplateCardsSuccess): void {
        patchState(cards);
    }

    @Action(LoadTemplateCardsError)
    loadTemplateCardsError({ patchState }: StateContext<ISelectTemplateState>): void {
        patchState({
            cards: []
        });
    }
}
