import { Directive, Input, ElementRef, HostBinding, HostListener, ContentChildren, QueryList } from '@angular/core';
import { BadgeComponent } from '@teq/shared/components/badge/badge.component';
import { PhasesColors } from '@teq/shared/lib/colors.lib';

@Directive({
    selector: '[teqPhaseHover]'
})
export class PhaseHoverDirective {
    @Input() name!: string;
    @HostBinding('style.backgroundColor') backgroundColor!: string;
    @ContentChildren('badge', { descendants: true }) badges!: QueryList<BadgeComponent>;

    get phaseName(): string {
        return this.name.toLowerCase();
    }

    get phaseColor(): string {
        return PhasesColors[this.phaseName];
    }

    get parentEl(): HTMLElement | null {
        return this._element.nativeElement.parentElement;
    }

    constructor(private readonly _element: ElementRef<HTMLElement>) {}

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this._toggleColor(this.phaseColor);
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this._toggleColor(undefined);
    }

    private _toggleColor(phaseColor: string | undefined): void {
        this._element.nativeElement.classList.toggle(this.phaseName);

        this.badges.forEach(badge => {
            badge.color = phaseColor;
        });

        if (!this.parentEl) {
            return;
        }

        const subphasesWrapper: HTMLElement | null = this.parentEl.querySelector('[data-subphases-wrapper]');

        if (!subphasesWrapper) return;

        subphasesWrapper.style.border = phaseColor ? `2px solid ${this.phaseColor}` : 'none';
        Array.from(subphasesWrapper.children).forEach(subphase => {
            subphase.toggleAttribute('data-reduce-padding');
            const span = subphase.querySelector('span');
            if (span) {
                span.style.color = phaseColor ?? '';
            }
        });
    }
}
