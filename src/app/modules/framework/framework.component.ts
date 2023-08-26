import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { PaginationService } from '@teq/shared/components/tree-previewer/components/pagination/pagination.service';
import { SVGRendererService } from '@teq/shared/components/tree-previewer/components/svg/svg.service';
import { generateResource } from '@teq/shared/lib/resource.lib';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import { APIService } from '@teq/shared/states/api/api.service';
import { IPagination } from '@teq/shared/types/pagination.type';

@UntilDestroy()
@Component({
    selector: 'teq-framework',
    templateUrl: './framework.component.html',
    styleUrls: ['./framework.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn]
})
export class FrameworkComponent implements OnInit {
    public readonly phases$ = this._apiService.phases$;

    public readonly svgOptions$ = this._svgRenderingService.options$;

    private _scale = 1;

    private _maxPhases = 0;

    private _pagination: IPagination = { page: 1, zoom: 4 };

    private _dataLoadingOverlay!: number;

    private _svgGenerationOverlay!: number;

    constructor(
        private readonly _paginationService: PaginationService,
        private readonly _svgRenderingService: SVGRendererService,
        private readonly _apiService: APIService,
        private readonly _overlayService: OverlayService,
        private readonly _element: ElementRef<HTMLElement>
    ) {}

    ngOnInit(): void {
        this._dataLoadingOverlay = this._overlayService.add(OverlayType.Loading, {
            message: 'Loading data...'
        });

        this.phases$.pipe(untilDestroyed(this)).subscribe(phases => {
            this._maxPhases = phases.length;

            this._overlayService.remove(this._dataLoadingOverlay);
        });
    }

    get maxPhases(): number {
        return this._maxPhases;
    }

    get pagination(): IPagination {
        return this._pagination;
    }

    paginationChanged(pagination: IPagination): void {
        this._paginationService.setPagination(pagination);
        this._pagination = { ...pagination };
    }

    scaleChanged(scale: number): void {
        this._scale = scale;
    }

    generateSVG(): void {
        const wrapper = this._element.nativeElement.querySelector('[data-phase-wrapper]') as HTMLDivElement;
        const headingsWrapper = this._element.nativeElement.querySelector('[data-phase-wrapper] [data-heading]') as HTMLDivElement;
        const contentWrapper = this._element.nativeElement.querySelector('[data-phase-wrapper] [data-content]') as HTMLDivElement;

        if (wrapper && contentWrapper && headingsWrapper) {
            // Set loading status
            this._svgGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
                message: 'Generating SVG...'
            });

            this._svgRenderingService.setOptions(this._svgRenderingService.computeOptions(this._scale, wrapper, headingsWrapper, contentWrapper));

            setTimeout(() => {
                const svg = this._element.nativeElement.querySelector('[data-svg-renderer] > svg') as HTMLElement;

                if (svg) {
                    generateResource(svg, { type: 'image/svg+xml', hint: 'full-framework.svg', download: false });
                    this._overlayService.remove(this._svgGenerationOverlay);
                }
            }, 1000);
        }
    }
}
