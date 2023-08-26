import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import type { IRoleCount } from '../phase-card/phase-card.component';
import { IPhase } from '@teq/shared/types/phase.type';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RoleType } from '@teq/shared/types/roles.type';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { BadgeComponent } from '@teq/shared/components/badge/badge.component';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
    selector: 'teq-roles-container',
    standalone: true,
    imports: [CommonModule, LabelComponent, BadgeComponent],
    templateUrl: './roles-container.component.html',
    styleUrls: ['./roles-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesContainerComponent implements OnInit, OnDestroy, OnChanges {
    @Input({ required: true }) roles!: IRoleCount[];
    @Input() unlimited!: boolean;
    @Input() phase!: IPhase;

    width$ = new BehaviorSubject<number>(0);

    length!: number;

    initialised = false;

    private readonly _roleSizes: Partial<Record<RoleType, number>> = {};

    private _moreRolesLabel = -1;

    private _containerGap = -1;

    private _observer!: ResizeObserver;

    constructor(private readonly _element: ElementRef<HTMLElement>, private readonly _zone: NgZone, private readonly _cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.length = this.roles.length;

        this._observer = new ResizeObserver(entries => {
            this._zone.run(() => {
                this.width$.next(entries[0].contentRect.width);
            });
        });

        this.width$
            .asObservable()
            .pipe(untilDestroyed(this))
            .subscribe(_ => {
                this._computeLength();
            });

        const el = this._element.nativeElement.firstElementChild;

        if (el) {
            this._observer.observe(el);
        }
    }

    ngOnDestroy(): void {
        const el = this._element.nativeElement.firstElementChild;

        if (el) {
            this._observer.unobserve(el);
        }

        this._observer.disconnect();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('roles' in changes) {
            const roles = changes['roles'].currentValue as IRoleCount[];

            if (roles.map(r => r.role.name).join('|') !== this.roles.map(r => r.role.name).join('|')) {
                this._computeLength();
            }
        }
    }

    get computedLength(): number {
        return this.unlimited ? this.roles.length : this.length;
    }

    private _computeLength(): void {
        let width = this.width$.value || this._element.nativeElement.firstElementChild?.getBoundingClientRect().width;

        // Ignore unbound element observations
        if (width) {
            this._element.nativeElement.querySelectorAll('[data-role]').forEach(roleEl => {
                this._roleSizes[roleEl.getAttribute('data-role') as RoleType] = roleEl.getBoundingClientRect().width;
            });

            if (this._containerGap < 0) {
                const container = this._element.nativeElement.firstElementChild;

                if (container) {
                    this._containerGap = parseInt(window.getComputedStyle(container).gap, 10) ?? 0;
                }
            }

            if (this._moreRolesLabel < 0) {
                const moreRoles = this._element.nativeElement.querySelector('[data-more]');

                if (moreRoles) {
                    this._moreRolesLabel = moreRoles.getBoundingClientRect().width;
                }
            }

            let i = 0;

            if (width > this._moreRolesLabel) {
                width -= this._moreRolesLabel;

                for (const role of this.roles) {
                    const roleWidth = this._roleSizes[role.role.name] ?? 0;

                    if (roleWidth + this._containerGap > width) {
                        break;
                    }

                    width -= roleWidth + this._containerGap;
                    i += 1;
                }
            }

            this.initialised = true;

            if (this.length !== i) {
                this.length = i; // Update the length

                this._cdr.detectChanges();
            }
        }
    }
}
