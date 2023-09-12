/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { IntersectionObserverDirective } from './intersection-observer';
import { APIService } from '../states/api/api.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NEVER, Subject, map, switchMap, timer } from 'rxjs';

type LazyRequestCondition = 'viewport-intersection' | 'mouse-interaction' | 'both';

type InteractionStatus = 'hover' | 'clicked' | 'intersected' | 'none';

const viewportIntersectionTrackers: Partial<Record<LazyRequestCondition, boolean>> = {
    both: true,
    'viewport-intersection': true
};

const pointerIntersectionTrackers: Partial<Record<LazyRequestCondition, boolean>> = {
    both: true,
    'mouse-interaction': true
};

const DebounceInterval = 500;

enum InteractionType {
    Cancelling = 0,
    Instant = 1,
    Debounced = 2
}

@Directive({
    selector: '[teqLazyRequested]',
    standalone: true
})
@UntilDestroy()
export class LazyRequestDirective implements OnInit, OnChanges, OnDestroy {
    @Input({ required: true }) mechanism!: LazyRequestCondition;

    @Input({ required: true }) id!: string;

    @Input({ required: true }) requestFn!: CallableFunction;

    private _status: InteractionStatus = 'none';

    private _requested = false;
    private _requesting = false;

    private readonly _requestData = new Subject<InteractionType>();

    constructor(private readonly _observer: IntersectionObserverDirective, private readonly _element: ElementRef, private readonly _apiService: APIService) {}

    @HostListener('mouseenter') onMouseEnter(): void {
        this._status = 'hover';
        this._requestData.next(InteractionType.Instant);
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        this._status = 'none';
        this._requestData.next(InteractionType.Cancelling);
    }

    @HostListener('mousedown') onMouseDown(): void {
        // Request without a delay
        this._status = 'clicked';
        this._requestData.next(InteractionType.Instant);
    }

    ngOnInit(): void {
        // Determine if data should be requested

        if (viewportIntersectionTrackers[this.mechanism]) {
            // Track viewport intersections
            this._observer.add(this._element.nativeElement as HTMLElement, this._onIntersection.bind(this));
        }

        this._requestData
            .pipe(
                switchMap(val => {
                    if (this._shouldRequestData()) {
                        this._requesting = true;

                        if (this._status === 'clicked') {
                            this._status = 'none';
                        }

                        return timer(val === InteractionType.Debounced ? DebounceInterval : 0).pipe(map(_ => this.requestFn(this.id)));
                    }

                    // Cancel request
                    return NEVER;
                })
            )
            .subscribe(_ => {
                this._requested = true;
                this._requesting = false;
            });
    }

    ngOnDestroy(): void {
        if (viewportIntersectionTrackers[this.mechanism]) {
            // Remove viewport intersection listening
            this._observer.remove(this._element.nativeElement as HTMLElement);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('id' in changes) {
            const id = (changes['id'].currentValue as string) ?? this.id;

            if (id) {
                if (id !== this.id) {
                    this._requested = false;
                }
            }
        }
    }

    private _shouldRequestData(): boolean {
        if (this._status !== 'none' && (viewportIntersectionTrackers[this.mechanism] ?? pointerIntersectionTrackers[this.mechanism])) {
            if (!this._requested && !this._requesting) {
                return true;
            }
        }

        return false;
    }

    private _onIntersection(entry: IntersectionObserverEntry): void {
        if (entry.isIntersecting) {
            this._status = 'intersected';

            this._requestData.next(InteractionType.Debounced);
        } else {
            this._status = 'none';

            this._requestData.next(InteractionType.Cancelling);
        }
    }
}
