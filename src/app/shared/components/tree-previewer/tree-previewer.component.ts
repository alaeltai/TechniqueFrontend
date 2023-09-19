import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import type { OnChanges, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { generateResource } from '@teq/shared/lib/resource.lib';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import type { IPagination } from '@teq/shared/types/pagination.type';
import type { IPhase } from '@teq/shared/types/phase.type';

import { FiltersService } from '../filters/filters.service';
import { ToggleComponent } from '../toggle/toggle.component';
import { TreeViewerComponent } from '../tree-viewer/tree-viewer.component';

import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationService } from './components/pagination/pagination.service';
import { ExportService } from './export.service';

@UntilDestroy()
@Component({
    selector: 'teq-tree-previewer',
    standalone: true,
    imports: [CommonModule, TreeViewerComponent, PaginationComponent, ToggleComponent],
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

    private _scale = 1;

    private _resourceGenerationOverlay!: number;

    constructor(
        private readonly _paginationService: PaginationService,
        private readonly _exportService: ExportService,
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
        return this._generateExport('svg');
    }

    generatePDF(): void {
        return this._generateExport('pdf');
    }

    generateTeq(): void {
        this._resourceGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
            message: 'Generating TEQ...'
        });

        setTimeout(() => {
            generateResource(FiltersService.computeDisableMap(this.phases ?? []), {
                type: 'application/json',
                hint: this._generateName('teq'),
                download: true
            });

            setTimeout(() => this._overlayService.remove(this._resourceGenerationOverlay), 250);
        }, 500);
    }

    private _generateExport(type: 'svg' | 'pdf'): void {
        // Disallow filtering while generating export
        const isSVG = type === 'svg';
        const filterDisabled = this.filterDisabled;
        this.filterDisabled = true;

        // Set loading status
        this._resourceGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
            message: `Generating ${type.toUpperCase()}...`
        });

        this._exportService[isSVG ? 'exportSVG' : 'exportPDF'](this.phases ?? []).subscribe(generated => {
            console.log(generated);

            if (generated) {
                generateResource(generated, {
                    type: isSVG ? 'image/svg+xml' : 'application/pdf',
                    hint: this.preview ? this._generateName(isSVG ? 'svg' : 'pdf') : `full-framework.${type}`,
                    download: true
                });
            }

            // Restore filtering status
            this.filterDisabled = filterDisabled;

            this._overlayService.remove(this._resourceGenerationOverlay);
        });
    }

    private _generateName(type: 'svg' | 'pdf' | 'teq'): string {
        return `framework-${new Date().toLocaleDateString()}.${type}`;
    }

    toggleVisibilityFilter(): void {
        this.filterDisabled = !this.filterDisabled;

        this.filterDisabledChanged.emit(this.filterDisabled);
    }
}
