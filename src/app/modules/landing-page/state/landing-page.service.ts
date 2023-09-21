import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LandingPageState } from '@teq/modules/landing-page/state/landing-page.state';
import { LoadLandingCards } from '@teq/modules/landing-page/state/landing-page.actions';
import { ILandingCard } from '@teq/modules/landing-page/types/landing-card.type';

@Injectable()
export class LandingPageService {
    @Select(LandingPageState.cards)
    public readonly cards$!: Observable<ILandingCard[]>;

    constructor(private readonly _store: Store) {}

    loadLandingCards(): void {
        this._store.dispatch(new LoadLandingCards());
    }
}
