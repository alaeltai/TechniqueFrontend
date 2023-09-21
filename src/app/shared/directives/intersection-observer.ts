import { Directive, OnDestroy } from '@angular/core';

type IntersectionHandlerFn = (entry: IntersectionObserverEntry) => void;

const DebounceInterval = 250;

@Directive({
    selector: '[teqIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnDestroy {
    private readonly _elementsMap: Map<HTMLElement, IntersectionHandlerFn>;
    private readonly _observer: IntersectionObserver;

    private _lastScheduled = 0;

    constructor() {
        this._elementsMap = new Map();

        this._observer = new IntersectionObserver(this._scheduleEvaluation.bind(this), {
            // Use the viewport as root element without any repositioning
            threshold: [0, 1] // Only trigger changes when the full entity is visible
        });
    }

    ngOnDestroy(): void {
        this._elementsMap.clear();
        this._observer.disconnect();
    }

    public add(element: HTMLElement, callback: IntersectionHandlerFn): void {
        this._elementsMap.set(element, callback);
        this._observer.observe(element);
    }

    public remove(element: HTMLElement): void {
        this._elementsMap.delete(element);
        this._observer.unobserve(element);
    }

    private _scheduleEvaluation(entries: IntersectionObserverEntry[]): void {
        if (!this._lastScheduled) {
            // Throttle evaluation
            this._lastScheduled = requestIdleCallback(
                () => {
                    // Iterate over the observed entries and call their respective handlers as needed
                    entries.forEach(entry => this._elementsMap.get(entry.target as HTMLElement)?.(entry));
                },
                { timeout: DebounceInterval }
            );
        } else {
            cancelIdleCallback(this._lastScheduled);
            this._lastScheduled = 0;
        }
    }
}
