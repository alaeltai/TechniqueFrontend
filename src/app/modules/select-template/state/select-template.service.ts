import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SelectTemplateState } from '@teq/modules/select-template/state/select-template.state';
import { ITemplateCard } from '@teq/modules/select-template/types/template-card.type';
import { LoadTemplateCards } from '@teq/modules/select-template/state/select-template.actions';

@Injectable()
export class SelectTemplateService {
    @Select(SelectTemplateState.cards)
    public readonly templates$!: Observable<ITemplateCard[]>;

    constructor(private readonly _store: Store) {}

    loadTemplateCards(): void {
        this._store.dispatch(new LoadTemplateCards());
    }
}
