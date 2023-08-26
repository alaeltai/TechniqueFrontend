import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
// import { Router } from '@angular/router';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { commitPreviewState, fetchPreviewState, removePreviewState } from '@teq/shared/lib/preview-storage.lib';
import { IPhase } from '@teq/shared/types/phase.type';

@UntilDestroy()
@Component({
    selector: 'teq-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn]
})
export class PreviewComponent implements OnInit, OnDestroy {
    public phases$: IPhase[] = [];

    public filterDisabled = false;

    private _previewId = 0;

    public constructor(private readonly _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this._activeRoute.params.pipe(untilDestroyed(this)).subscribe(params => {
            if ('id' in params) {
                this._previewId = params['id'] as number;

                const state = fetchPreviewState();
                // this._previewId

                if (state) {
                    this.phases$ = state.data;
                    this.filterDisabled = !!state.filterDisabled;
                }
            }
        });
    }

    ngOnDestroy(): void {
        removePreviewState();
    }

    filterDisabledChanged(value: boolean): void {
        this.filterDisabled = value;

        commitPreviewState(
            this.phases$,
            0, // TODO: Replace with actual id
            value
        );
    }
}
