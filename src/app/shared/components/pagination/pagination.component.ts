import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { IPagination } from '@teq/shared/types/pagination.type';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'teq-pagination',
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, IconComponent, IconComponent],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() pagination!: IPagination;

    @Input() maxPages!: number;

    @Output() paginationChanged = new EventEmitter<IPagination>();

    get isFirstPage(): boolean {
        return this.pagination.page === 1;
    }

    get isLastPage(): boolean {
        return this.pagination.page === this.pagination.zoom;
    }

    get isFullZoomedIn(): boolean {
        return this.pagination.zoom === this.maxPages;
    }

    get isFullZoomedOut(): boolean {
        return this.pagination.zoom === 1;
    }

    zoomOut(): void {
        this.paginationChanged.emit({
            zoom: this.pagination.zoom - 1,
            page: this.pagination.page === this.pagination.zoom ? this.pagination.page - 1 : this.pagination.page
        });
    }

    zoomIn(): void {
        if (!this.pagination) {
            return;
        }

        this.paginationChanged.emit({
            zoom: this.pagination.zoom + 1,
            page: this.pagination.page
        });
    }

    scrollLeft(): void {
        if (!this.pagination) {
            return;
        }

        this.paginationChanged.emit({
            zoom: this.pagination.zoom,
            page: this.pagination.page - 1
        });
    }

    scrollRight(): void {
        if (!this.pagination) {
            return;
        }

        this.paginationChanged.emit({
            zoom: this.pagination.zoom,
            page: this.pagination.page + 1
        });
    }
}
