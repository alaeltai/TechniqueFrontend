import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TreeViewerComponent } from '../tree-viewer/tree-viewer.component';
import { PaginationService } from './components/pagination/pagination.service';
import { SVGRendererService } from './components/svg/svg.service';
import { APIService } from '@teq/shared/states/api/api.service';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { IPagination } from '@teq/shared/types/pagination.type';
import { generateResource } from '@teq/shared/lib/resource.lib';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SVGRendererComponent } from './components/svg/svg.component';
import { CommonModule } from '@angular/common';
import { IPhase } from '@teq/shared/types/phase.type';
import { ToggleComponent } from '../toggle/toggle.component';

@UntilDestroy()
@Component({
    selector: 'teq-tree-previewer',
    standalone: true,
    imports: [CommonModule, TreeViewerComponent, PaginationComponent, SVGRendererComponent, ToggleComponent],
    templateUrl: './tree-previewer.component.html',
    styleUrls: ['./tree-previewer.component.scss'],
    animations: [fadeIn]
})
export class TreePreviewerComponent implements OnChanges {
    @Input({ required: true }) phases: IPhase[] | null = [];

    @Input() exportable = false;

    @Input() preview = false;

    @Input() enableVisibility = false;

    @Input() filterDisabled = false;

    @Output() filterDisabledChanged = new EventEmitter<boolean>();

    public readonly svgOptions$ = this._svgRenderingService.options$;

    private _scale = 1;

    private _resourceGenerationOverlay!: number;

    constructor(
        private readonly _paginationService: PaginationService,
        private readonly _svgRenderingService: SVGRendererService,
        private readonly _apiService: APIService,
        private readonly _overlayService: OverlayService,
        private readonly _element: ElementRef<HTMLElement>
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('phases' in changes) {
            const phases = changes['phases'].currentValue as IPhase[];

            this.paginationChanged({
                page: this._paginationService.snapshot.page,
                zoom: phases.length > 0 ? phases.length : 1
            });
        }
    }

    get pagination(): IPagination {
        return this._paginationService.snapshot;
    }

    paginationChanged(pagination: IPagination): void {
        this._paginationService.setPagination(pagination);
    }

    scaleChanged(scale: number): void {
        this._scale = scale;
    }

    generateSVG(): void {
        // Enforce filtering while generating the SVG
        const filterDisabled = this.filterDisabled;
        this.filterDisabled = true;

        const wrapper = this._element.nativeElement.querySelector('[data-phase-wrapper]') as HTMLDivElement;
        const headingsWrapper = this._element.nativeElement.querySelector('[data-phase-wrapper] [data-heading]') as HTMLDivElement;
        const contentWrapper = this._element.nativeElement.querySelector('[data-phase-wrapper] [data-content]') as HTMLDivElement;

        if (wrapper && contentWrapper && headingsWrapper) {
            // Set loading status
            this._resourceGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
                message: 'Generating SVG...'
            });

            setTimeout(() => {
                this._svgRenderingService.setOptions(this._svgRenderingService.computeOptions(this._scale, wrapper, headingsWrapper, contentWrapper));

                setTimeout(() => {
                    const svg = this._element.nativeElement.querySelector('[data-svg-renderer] > svg') as HTMLElement;

                    if (svg) {
                        generateResource(svg, {
                            type: 'image/svg+xml',
                            hint: this.preview ? this._generateName('svg') : 'full-framework.svg',
                            download: false
                        });
                    }

                    // Restore filtering status
                    this.filterDisabled = filterDisabled;

                    this._overlayService.remove(this._resourceGenerationOverlay);
                }, 1000);
            }, 100);
        }
    }

    generateTeq(): void {
        this._resourceGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
            message: 'Generating TEQ...'
        });

        generateResource(this.phases ?? [], { type: 'application/json', hint: this._generateName('teq'), download: true });
        this._overlayService.remove(this._resourceGenerationOverlay);
    }

    private _generateName(type: 'svg' | 'teq'): string {
        return `framework-${new Date().toLocaleDateString()}.${type}`;
    }

    toggleVisibilityFilter(): void {
        this.filterDisabled = !this.filterDisabled;

        this.filterDisabledChanged.emit(this.filterDisabled);
    }
}
