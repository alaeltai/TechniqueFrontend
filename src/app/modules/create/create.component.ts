import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
import { OverlayService } from '@teq/shared/services/overlay.service';
import { APIService } from '@teq/shared/states/api/api.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent extends TreeBasedPageComponent {
    public disableMap: Record<string, boolean> = {};

    constructor(
        protected override readonly _apiService: APIService,
        protected override readonly _overlayService: OverlayService,
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
}
