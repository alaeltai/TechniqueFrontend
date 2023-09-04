/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IListItem } from '@teq/shared/components/side-list/side-list.component';
import { APIService } from '@teq/shared/states/api/api.service';
import { IFaq } from '@teq/shared/types/faq.type';
import { BehaviorSubject, Observable } from 'rxjs';

@UntilDestroy()
@Component({
    selector: 'teq-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
    public faq$ = this._apiService.faq$;

    public selected = '';

    public term = new FormControl('');

    private _faqMap: Record<string, IFaq> = {};

    private _faq: IFaq[] = [];

    private readonly _computedItems = new BehaviorSubject<IListItem[]>([]);

    constructor(private readonly _apiService: APIService) {}

    ngOnInit(): void {
        this._apiService.getFaq();

        this._apiService.faq$.pipe(untilDestroyed(this)).subscribe(faq => {
            this._faqMap = {};
            this._faq = faq;

            this._faq.forEach(f => {
                this._faqMap[f.id] = f;
            });

            this._computedItems.next(this._computeItems(this._filter(faq, this.term.value ?? '')));

            if (!this.selected && faq.length) {
                this.selected = faq[0].id.toString();
            }
        });

        this.term.valueChanges.pipe(untilDestroyed(this)).subscribe(t => this.termChanged(t ?? ''));
    }

    get current(): IFaq {
        return this._faqMap[this.selected];
    }

    selectionChanged(selected: string): void {
        this.selected = selected;
    }

    get computedItems$(): Observable<IListItem[]> {
        return this._computedItems.asObservable();
    }

    termChanged(term: string): void {
        this._computedItems.next(this._computeItems(this._filter(this._faq, term)));
    }

    private _computeItems(faq: IFaq[]): IListItem[] {
        return faq.map(f => {
            return { value: f.id, label: f.question } as unknown as IListItem;
        });
    }

    private _filter(faq: IFaq[], term = ''): IFaq[] {
        const isMatchAll = term.trim() === '';

        return faq
            .map(f => {
                if (isMatchAll || this._matchesStrings(term, f.answer, f.question)) {
                    return { ...f };
                }

                return null;
            })
            .filter(Boolean) as IFaq[];
    }

    private _matchesStrings(term: string, ...strings: string[]): boolean {
        const t = term.toLowerCase();
        return strings
            .flat(2)
            .filter(Boolean)
            .some(s => s.toLowerCase().includes(t));
    }
}
