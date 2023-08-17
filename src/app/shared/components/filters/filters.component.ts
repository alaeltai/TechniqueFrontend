import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import type { IFilters } from '@teq/shared/components/filters/types/filters.type';
import { SelectComponent } from '@teq/shared/components/select/select.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { take } from 'rxjs';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPhase } from '@teq/shared/types/phase.type';

@UntilDestroy()
@Component({
    selector: 'teq-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgFor, NgIf, NgStyle, FormsModule, ReactiveFormsModule, ToggleComponent, SelectComponent, SearchComponent],
    providers: [FiltersService]
})
export class FiltersComponent implements OnInit {
    public filtersForm!: FormGroup;
    public filtersData!: IFilters;

    @Input({ required: true }) phases!: IPhase[];
    @Input() enableToggles?: boolean;
    @Input() enableVisibility?: boolean;
    @Input() complexity?: string;

    @Output() filtersChanged: EventEmitter<IFilters> = new EventEmitter<IFilters>();

    constructor(private readonly _fb: FormBuilder, private readonly _filtersService: FiltersService) {
        this._initForm();
    }

    ngOnInit(): void {
        this._filtersService
            .getFilters()
            .pipe(take(1))
            .subscribe(filters => (this.filtersData = filters));

        this.filtersForm.valueChanges.pipe(untilDestroyed(this)).subscribe(filters => {
            if (filters) {
                this.filtersChanged.emit(filters as IFilters);
            }
        });

        this.filtersData = {
            selects: [],
            toggles: []
        };
    }

    private _initForm(): void {
        this.filtersForm = this._fb.group({
            searchText: '',
            category: '',
            role: '',
            complexity: this.complexity ?? '',
            showToggles: false,
            hideDisables: false
        });
    }
}
