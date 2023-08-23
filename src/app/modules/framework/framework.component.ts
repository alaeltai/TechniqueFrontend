import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, WritableSignal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FrameworkService } from '@teq/modules/framework/state/framework.service';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { asSVGRenderingOptions, sortSVGOptions } from '@teq/shared/lib/svg.lib';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import { APIService } from '@teq/shared/states/api/api.service';
import { IPagination } from '@teq/shared/types/pagination.type';
import type { SVGNode } from '@teq/shared/types/svg.type';
import { ITask } from '@teq/shared/types/task.type';

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

    public readonly pagination$ = this._frameworkService.pagination$;

    public readonly svgOptions$ = this._frameworkService.svgOptions$;

    private _scale = 1;

    private _maxPhases = 0;

    private _pagination: IPagination = { page: 1, zoom: 4 };

    private _dataLoadingOverlay!: number;

    private _svgGenerationOverlay!: number;

    constructor(
        private readonly _frameworkService: FrameworkService,
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

    get page(): number {
        return this._pagination.page ?? 1;
    }

    get maxPhases(): number {
        return this._maxPhases;
    }

    get pagination(): IPagination {
        return this._pagination;
    }

    paginationChanged(pagination: IPagination): void {
        this._frameworkService.paginationChanged(pagination);
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

            setTimeout(() => {
                const svgContents: SVGNode[] = [];
                const upscaleRatio = 1 / this._scale;

                // Convert headings
                sortSVGOptions(
                    asSVGRenderingOptions(headingsWrapper, svgContents, {
                        offsetX: headingsWrapper.getBoundingClientRect().x * upscaleRatio,
                        offsetY: headingsWrapper.getBoundingClientRect().y * upscaleRatio,
                        scale: upscaleRatio
                    })
                );

                // Convert content
                sortSVGOptions(
                    asSVGRenderingOptions(contentWrapper, svgContents, {
                        offsetX: contentWrapper.getBoundingClientRect().x * upscaleRatio,
                        offsetY: contentWrapper.getBoundingClientRect().y * upscaleRatio,
                        scale: upscaleRatio
                    })
                );

                this._frameworkService.svgRenderingOptionsChanged({
                    width: contentWrapper.offsetWidth,
                    height: wrapper.offsetHeight,
                    contents: svgContents
                });

                // TODO: Fix to not use timeout
                setTimeout(() => {
                    const svg = this._element.nativeElement.querySelector('[data-svg-renderer] > svg');

                    if (svg) {
                        // const xml = new XMLSerializer().serializeToString(svg);
                        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
                        // const imgSrc = `data:image/svg+xml;base64,${btoa(xml)}`;
                        const url = URL.createObjectURL(blob);
                        // window.open(url);

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'full-framework.svg';
                        a.click();

                        URL.revokeObjectURL(url);

                        this._overlayService.remove(this._svgGenerationOverlay);
                    }
                }, 1000);
            }, 100);
        }
    }
}
