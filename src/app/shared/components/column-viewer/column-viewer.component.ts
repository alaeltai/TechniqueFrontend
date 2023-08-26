import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { IPhase } from '@teq/shared/types/phase.type';
import { TreeViewerComponent } from '../tree-viewer/tree-viewer.component';
import { APIService } from '@teq/shared/states/api/api.service';
import { FilterType, FiltersService } from '../filters/filters.service';
import { FiltersValue } from '../filters/types/filters.type';
import { PhaseCardComponent } from './components/phase-card/phase-card.component';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { FiltersComponent } from '../filters/filters.component';
import { CommonModule } from '@angular/common';
import { PhaseComponent } from '../tree-viewer/components/phase/phase.component';
import { MethodComponent } from '../tree-viewer/components/method/method.component';
import { commitPreviewState, removePreviewState } from '@teq/shared/lib/preview-storage.lib';

@UntilDestroy()
@Component({
    selector: 'teq-column-viewer',
    standalone: true,
    imports: [CommonModule, RouterModule, IconComponent, FiltersComponent, PhaseCardComponent, PhaseComponent, MethodComponent],
    templateUrl: './column-viewer.component.html',
    styleUrls: ['./column-viewer.component.scss'],
    animations: [fadeIn]
})
export class ColumnViewerComponent implements OnDestroy {
    @Input() enableToggles?: boolean;
    @Input() enableVisibility?: boolean;
    @Input() enableComplexity?: boolean;
    @Input() complexity?: string;
    @Input() preview?: boolean;

    @Input() tailoring?: boolean;

    public phases$: Observable<IPhase[]>;
    public showTree = false;
    public page?: number;

    private _aggregatedCounts: Array<{ methods: number; approaches: number }> = [];

    private _aggregatedPhases: Record<number, string> = {};

    private _disableable!: boolean;
    private _filterDisabled!: boolean;

    private _previewData: IPhase[] = [];

    private _previewId = 0;

    @ViewChild(TreeViewerComponent) treeViewer!: TreeViewerComponent;

    constructor(private readonly _filtersService: FiltersService, private readonly _apiService: APIService) {
        this.phases$ = this._filtersService.phases$;

        // Compute the total amounts for cards
        this._apiService.phases$.pipe(untilDestroyed(this)).subscribe(phases => {
            this._aggregatedCounts = [];

            phases.forEach((phase, i) => {
                let methods = 0;
                let approaches = 0;

                this._aggregatedPhases[i] = phase.name.toLowerCase(); // Remember the phase name

                phase.subphases?.forEach(s => {
                    s.methods.forEach(m => {
                        methods += 1;

                        m.approaches.forEach(a => {
                            approaches += 1;
                        });
                    });
                });

                this._aggregatedCounts.push({ methods, approaches });
            });
        });
    }

    ngOnDestroy(): void {
        // Remove any left over state from the local storage on destory
        if (this._previewId) {
            removePreviewState();
            // this._previewId
        }
    }

    get previewData(): IPhase[] {
        return this._previewData;
    }

    get disableable(): boolean {
        return this._disableable;
    }

    get filterDisabled(): boolean {
        return this._filterDisabled;
    }

    getCardMethods(i: number): number {
        return this._aggregatedCounts[i]?.methods ?? 0;
    }

    getCardApproaches(i: number): number {
        return this._aggregatedCounts[i]?.approaches ?? 0;
    }

    getPagePhase(page = -1): string {
        return this._aggregatedPhases[page] ?? '';
    }

    changePage(page: number): void {
        this.page = page;

        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    filtersChanged(filters: FiltersValue): void {
        if (FilterType.ToggleDisableControl in filters) {
            // Update disableable
            this._disableable = filters[FilterType.ToggleDisableControl] as boolean;
        }

        if (FilterType.ToggleFilterDisabled in filters) {
            // Update disableable
            this._filterDisabled = filters[FilterType.ToggleFilterDisabled] as boolean;
        }
    }

    navigateToPreview(): void {
        if (!this._previewId) {
            this._previewId = Date.now();
        }

        this._previewData = this._filtersService.getTailoredPhases();

        commitPreviewState(
            this.previewData
            // this._previewId
        );

        window.open(
            `/preview/${this._previewId}`,
            'preview-page' // this._previewId.toString()
        );
    }
}
