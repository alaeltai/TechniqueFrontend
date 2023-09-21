import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import { APIService } from '@teq/shared/states/api/api.service';

@Component({ template: '' })
@UntilDestroy()
export abstract class TreeBasedPageComponent implements OnInit {
    constructor(protected readonly _overlayService: OverlayService, protected readonly _apiService: APIService) {}

    private _dataLoadingOverlay!: number;

    ngOnInit(): void {
        this._apiService.treeStatus$.pipe(untilDestroyed(this)).subscribe(status => {
            if (!status.fetched && !status.fetching) {
                requestIdleCallback(() => {
                    this._dataLoadingOverlay = this._overlayService.add(OverlayType.Loading, {
                        message: 'Loading data...'
                    });

                    this._apiService.getDataTree();
                });
            } else if (!status.fetching && status.fetched && this._dataLoadingOverlay) {
                // Remove prior overlays
                this._overlayService.remove(this._dataLoadingOverlay);

                this._dataLoadingOverlay = 0;
            }
        });
    }
}
