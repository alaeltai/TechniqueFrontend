import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { IFilters } from '@teq/shared/components/filters/types/filters.type';
import { TreeViewerComponent } from '@teq/shared/components/tree-viewer/tree-viewer.component';
import { APIService } from '@teq/shared/states/api/api.service';
import type { IPhase } from '@teq/shared/types/phase.type';
@UntilDestroy()
@Component({
    selector: 'teq-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    animations: [fadeIn]
})
export class ExploreComponent implements OnInit {
    public phases!: IPhase[];
    public showTree = false;
    public page?: number;

    @ViewChild(TreeViewerComponent) treeViewer!: TreeViewerComponent;

    constructor(private readonly _apiService: APIService, public readonly router: Router, private readonly _element: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this._apiService.getDataTree();

        this._apiService.phases$.pipe(untilDestroyed(this)).subscribe(phases => (this.phases = phases));
    }

    filtersChanged(filters: IFilters): void {
        console.log(filters);
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
