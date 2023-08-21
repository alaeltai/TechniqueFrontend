import { Component, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { TreeViewerComponent } from '@teq/shared/components/tree-viewer/tree-viewer.component';
import { APIService } from '@teq/shared/states/api/api.service';
import type { IPhase } from '@teq/shared/types/phase.type';
import { Observable } from 'rxjs';
@UntilDestroy()
@Component({
    selector: 'teq-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    animations: [fadeIn]
})
export class ExploreComponent {
    public phases$: Observable<IPhase[]>;
    public showTree = false;
    public page?: number;

    private _aggregatedCounts: Array<{ methods: number; approaches: number }> = [];

    @ViewChild(TreeViewerComponent) treeViewer!: TreeViewerComponent;

    constructor(private readonly _filtersService: FiltersService, private readonly _apiService: APIService) {
        this.phases$ = this._filtersService.phases$;

        // Compute the total amounts for cards
        this._apiService.phases$.pipe(untilDestroyed(this)).subscribe(phases => {
            this._aggregatedCounts = [];

            phases.forEach(phase => {
                let methods = 0;
                let approaches = 0;

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

    getCardMethods(i: number): number {
        return this._aggregatedCounts[i]?.methods ?? 0;
    }

    getCardApproaches(i: number): number {
        return this._aggregatedCounts[i]?.approaches ?? 0;
    }

    changePage(page: number): void {
        this.page = page;

        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}
