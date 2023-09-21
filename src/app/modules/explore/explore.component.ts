import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
import { OverlayService } from '@teq/shared/services/overlay.service';
import { APIService } from '@teq/shared/states/api/api.service';
@UntilDestroy()
@Component({
    selector: 'teq-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    animations: [fadeIn]
})
export class ExploreComponent extends TreeBasedPageComponent implements OnDestroy {
    constructor(
        protected override readonly _apiService: APIService,
        protected override readonly _overlayService: OverlayService,
        private readonly _filtersService: FiltersService
    ) {
        super(_overlayService, _apiService);
    }

    ngOnDestroy(): void {
        this._filtersService.reset();
    }
}
