import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import type { FiltersValue, IFilters } from '@teq/shared/components/filters/types/filters.type';
import { SelectComponent } from '@teq/shared/components/select/select.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { Observable } from 'rxjs';
import { FilterType, FiltersService, MatchAllOfType } from '@teq/shared/components/filters/filters.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'teq-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, NgFor, NgIf, NgStyle, FormsModule, ReactiveFormsModule, ToggleComponent, SelectComponent, SearchComponent]
})
export class FiltersComponent implements OnInit {
    public filtersForm!: FormGroup;

    @Input() enableToggles?: boolean;
    @Input() enableVisibility?: boolean;
    @Input() enableComplexity?: boolean;
    @Input() complexity?: string;

    @Output() filtersChanged = new EventEmitter<FiltersValue>();

    constructor(private readonly _fb: FormBuilder, private readonly _filtersService: FiltersService) {}

    ngOnInit(): void {
        const originalFilters = this._filtersService.addFilters(
            ...[
                FilterType.SelectLevelOfDetail,
                ...(this.enableVisibility ? [FilterType.ToggleFilterDisabled] : []),
                ...(this.enableToggles ? [FilterType.ToggleDisableControl] : []),
                FilterType.SelectRoles,
                ...(this.enableComplexity ? [FilterType.SelectComplexity] : []),
                FilterType.SelectCategory,
                FilterType.Search
            ].filter(Boolean)
            // TODO: Add the ability to restore filter selections for page restores at this point once needed
        );

        this._initForm(originalFilters);

        this.filtersForm.valueChanges.pipe(untilDestroyed(this)).subscribe((filters: FiltersValue) => {
            if (filters) {
                // Provide outside world with updated filter values
                this.filtersChanged.emit(filters);

                // Refilter data based on current filter values
                this._filtersService.filter(filters as Record<string, string | number | boolean | Array<string | number | boolean>>);
            }
        });
    }

    get filters(): Observable<IFilters> {
        return this._filtersService.filters$;
    }

    private _initForm(filters: IFilters): void {
        const formControls: Record<string, string | string[] | boolean> = {};

        filters.toggles.forEach(t => (formControls[t.controlName] = t.value ?? false));
        filters.selects.forEach(s => (formControls[s.controlName] = s.value ?? (s.controlName === FilterType.Search ? '' : MatchAllOfType)));

        if (this.complexity) {
            // Ensure enforcing the prior selected complexity for create cases
            formControls[FilterType.SelectComplexity] = this.complexity;
        }

        this.filtersForm = this._fb.group(formControls);

        // Filter the data based on initial filters
        this._filtersService.filter(formControls);

        this.filtersChanged.emit(this.filtersForm.value as FiltersValue);
    }
}
