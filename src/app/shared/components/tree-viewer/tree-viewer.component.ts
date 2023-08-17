import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PhaseComponent } from './components/phase/phase.component';
import { MethodComponent } from './components/method/method.component';
import { SubphaseComponent } from './components/subphase/subphase.component';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { IPhase } from '@teq/shared/types/phase.type';

@Component({
    selector: 'teq-tree-viewer',
    templateUrl: './tree-viewer.component.html',
    styleUrls: ['./tree-viewer.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, NgStyle, PhaseComponent, SubphaseComponent, MethodComponent],
    animations: [fadeIn]
})
export class TreeViewerComponent implements OnChanges {
    @Input() zoom!: number;

    @Input() page!: number;

    @Input() phases!: IPhase[] | null;

    @Output() scaleChanged = new EventEmitter<number>();

    @HostBinding('style.--scale')
    private _cssScale = 1;

    @HostBinding('style.--translateX')
    private _translateX = '';

    private _filteredPhases: IPhase[] = [];

    constructor(private readonly _element: ElementRef<HTMLElement>) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('phases' in changes) {
            // Update phases ensuring support for showing/hidding disabled phases
            this._filteredPhases = this.filterPhases((changes['phases'].currentValue as IPhase[]) ?? []);

            if (!changes['phases'].isFirstChange()) {
                // Recompute scale and in translate on contents changes
                const scale = this.determineScale(this.zoom);
                const translate = this.determineTranslation(this.page, this.page, this.filteredPhases.length, this.zoom);

                this._translateX = `-${translate}px`;

                if (scale !== this._cssScale) {
                    this._cssScale = scale;
                    this.scaleChanged.emit(scale);
                }
            }
        }

        if ('zoom' in changes) {
            // Recompute the content scale on proportions changed
            const zoom = changes['zoom'].currentValue as number;
            const scale = this.determineScale(zoom);

            if (scale !== this._cssScale) {
                this._cssScale = scale;
                this.scaleChanged.emit(scale);
            }
        }

        if ('page' in changes) {
            // Recompute the content translateX on page changes
            const currPage = changes['page'].currentValue as number;
            const prevPage = (changes['page'].previousValue as number) ?? currPage;

            const translate = this.determineTranslation(currPage, prevPage);
            this._translateX = `-${translate}px`;
        }
    }

    get filteredPhases(): IPhase[] {
        return this._filteredPhases;
    }

    onTaskFocused(taskId: string): void {
        console.log('Task activated', taskId);
    }

    /**
     * Filters phases based on desired disabled visibility and filtered status
     */
    private filterPhases(phases: IPhase[]): IPhase[] {
        return phases;
    }

    private determineTranslation(currPage = 1, prevPage = 1, maxPages = this.filteredPhases.length, zoom = this.zoom): number {
        const columns = this.determineColumnsCount(zoom);
        const container = this.getWrapperElement();

        const renderedPhases = this.getPhasesElements();
        if (renderedPhases.length) {
            // Determine final area to be fit on screen
            const phasesInView = new Array(columns)
                .fill(currPage)
                .map((v: number, i) => v + i)
                .map(idx => renderedPhases[idx - 1]);

            const prevPhase = renderedPhases[prevPage - 1];
            const first = phasesInView[0];
            const last = phasesInView[phasesInView.length - 1];
            const scrollContainer = container.parentElement;

            if (first && last && prevPhase && scrollContainer && first.parentElement) {
                const toRight = prevPage < currPage;
                let scrollTo = 0;

                const parentGap = parseFloat(window.getComputedStyle(first.parentElement).gap);

                const area = {
                    start: first.offsetLeft,
                    end: last.offsetLeft + last.offsetWidth
                };

                if (!toRight) {
                    // Go towards left to the start of the intended visible area
                    scrollTo = area.start;
                } else {
                    // Scroll only the minimum amount towards the right
                    const viewportWidth = container.offsetWidth;

                    if (zoom < maxPages) {
                        // Scroll for less than full size jumps one page at a time
                        scrollTo = Math.max(area.start + parentGap / 4, 0);
                    } else {
                        // Scroll at full screen should take into account the phase fit on the screen
                        if (first.offsetWidth > viewportWidth) {
                            // Scroll to the start of the phase in order for the user to have the ability to at least understand his window is to small
                            scrollTo = area.start;
                        } else {
                            // Scroll by preserving the most of prior task
                            if (last === renderedPhases[renderedPhases.length - 1]) {
                                scrollTo = area.start - (viewportWidth - first.offsetWidth);
                            } else {
                                scrollTo = area.start - (viewportWidth - first.offsetWidth) + parentGap / 4;
                            }
                        }
                    }
                }

                if (scrollTo < 0) {
                    // Clip to the begining
                    scrollTo = 0;
                }

                return scrollTo;
            }
        }

        return 0;
    }

    private determineScale(zoom: number): number {
        const columns = this.determineColumnsCount(zoom);

        if (columns > 1) {
            const wrapper = this.getWrapperElement();
            const phase = this.getPhaseElement();

            if (wrapper && phase && phase.parentElement) {
                const parentGap = parseFloat(window.getComputedStyle(phase.parentElement).gap);
                const gap = Math.ceil(((columns - 1) / columns) * parentGap);
                const phaseWidth = phase.offsetWidth + gap;
                const viewportWidth = wrapper.offsetWidth;
                const maxPhaseWidth = viewportWidth / columns;

                if (maxPhaseWidth < phaseWidth) {
                    // Scale down phases to fit in screen
                    const scale = maxPhaseWidth / phaseWidth;

                    return Math.floor(scale * 1000) / 1000;
                }
            }
        }

        return 1;
    }

    private determineColumnsCount(zoom: number): number {
        return this.filteredPhases.length - zoom + 1;
    }

    private getWrapperElement(): HTMLElement {
        return this._element.nativeElement.querySelector('[data-phase-wrapper]') as HTMLDivElement;
    }

    private getPhaseElement(): HTMLElement {
        return this._element.nativeElement.querySelector('[data-heading] > div') as HTMLDivElement;
    }

    private getPhasesElements(): HTMLElement[] {
        const elements = this._element.nativeElement.querySelectorAll('[data-heading] > div');

        if (elements) {
            return Array.from(elements) as HTMLDivElement[];
        }

        return [];
    }

    public changeTranslationFromOutside(value: string): void {
        this._translateX = value;
    }
}
