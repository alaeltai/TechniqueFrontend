import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DeactivatableComponent } from '@teq/core/guards/can-deactivate-create.guard';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
import { APIService } from '@teq/shared/states/api/api.service';
import { OverlayService, OverlayTemplate, OverlayType } from '@teq/shared/services/overlay.service';
import { Observable } from 'rxjs';
import { CanLeaveRouteService } from '@teq/shared/services/can-leave-route.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent extends TreeBasedPageComponent implements OnInit, DeactivatableComponent, OnDestroy {
    public disableMap: Record<string, boolean> = {};

    @HostListener('window:beforeunload', ['$event'])
    preventClosingTab(event: Event): void {
        if (this._filtersService.hasDataChanges()) {
            event.preventDefault();
            event.returnValue = false;
        }
    }

    constructor(
        protected override readonly _apiService: APIService,
        protected override readonly _overlayService: OverlayService,
        private readonly _filtersService: FiltersService,
        private readonly _canLeaveRouteService: CanLeaveRouteService,
        private readonly _router: Router
    ) {
        super(_overlayService, _apiService);

        const route = this._router.getCurrentNavigation();

        if (route) {
            const state = route.extras.state;

            if (state) {
                if (state['imported']) {
                    // Replace the disable map by the imported state
                    this.disableMap = state['imported'] as Record<string, boolean>;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this._filtersService.reset();
    }

    canDeactivate(): boolean | Observable<boolean> {
        if (this._filtersService.hasDataChanges()) {
            this._overlayService.add(OverlayType.Data, {
                template: OverlayTemplate.TailoringConfirmation,
                data: FiltersService.computeDisableMap(this._filtersService.getTailoredPhases())
            });
            return this._canLeaveRouteService.canLeaveRoute$;
        }

        return true;
    }
}
