/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IListItem } from '@teq/shared/components/side-list/side-list.component';
import { APIService } from '@teq/shared/states/api/api.service';
import { IGlossary } from '@teq/shared/types/glossary.type';
import { BehaviorSubject, Observable } from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'teq-glosary',
    templateUrl: './glossary.component.html',
    styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
    public glossary$ = this._apiService.glossary$;

    public selected = '';

    public term = '';

    private _glossaryMap: Record<string, IGlossary> = {};

    private _glossary: IGlossary[] = [];

    private readonly _computedItems = new BehaviorSubject<IListItem[]>([]);

    constructor(private readonly _apiService: APIService) {}

    ngOnInit(): void {
        this._apiService.getGlossary();

        this._apiService.glossary$.pipe(untilDestroyed(this)).subscribe(glossary => {
            this._glossaryMap = {};
            this._glossary = glossary;

            this._glossary.forEach(f => {
                this._glossaryMap[f.id] = f;
            });

            this._computedItems.next(this._computeItems(this._filter(glossary, this.term)));

            if (!this.selected && glossary.length) {
                this.selected = glossary[0].id.toString();
            }
        });
    }

    get current(): IGlossary {
        return this._glossaryMap[this.selected];
    }

    selectionChanged(selected: string): void {
        this.selected = selected;
    }

    get computedItems$(): Observable<IListItem[]> {
        return this._computedItems.asObservable();
    }

    termChanged(event: Event): void {
        if (event.target) {
            this.term = (event.target as HTMLInputElement).value;

            this._computedItems.next(this._computeItems(this._filter(this._glossary, this.term)));
        }
    }

    private _computeItems(glossary: IGlossary[]): IListItem[] {
        return glossary.map(f => {
            return { value: f.id, label: f.title } as unknown as IListItem;
        });
    }

    private _filter(glossary: IGlossary[], term = ''): IGlossary[] {
        const isMatchAll = term.trim() === '';

        return glossary
            .map(f => {
                if (isMatchAll || this._matchesStrings(term, f.title, f.definition)) {
                    return { ...f };
                }

                return null;
            })
            .filter(Boolean) as IGlossary[];
    }

    private _matchesStrings(term: string, ...strings: string[]): boolean {
        const t = term.toLowerCase();
        return strings
            .flat(2)
            .filter(Boolean)
            .some(s => s.toLowerCase().includes(t));
    }
}
