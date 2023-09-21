import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { generateResource } from '@teq/shared/lib/resource.lib';
import { CanLeaveRouteService } from '@teq/shared/services/can-leave-route.service';
import { OverlayService, OverlayType } from '@teq/shared/services/overlay.service';
import { IPhase } from '@teq/shared/types/phase.type';

@Component({
    selector: 'teq-create-exit-confirmation',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './create-exit-confirmation.component.html',
    styleUrls: ['./create-exit-confirmation.component.scss']
})
export class CreateExitConfirmationComponent {
    @Input() previewData: IPhase[] = [];
    @Input() registrationId!: number;

    private _resourceGenerationOverlay = 0;

    constructor(
        private readonly _overlayService: OverlayService,
        private readonly _router: Router,
        private readonly _canLeaveRouteService: CanLeaveRouteService
    ) {}

    saveChanges(): void {
        this._resourceGenerationOverlay = this._overlayService.add(OverlayType.Loading, {
            message: 'Generating TEQ...'
        });

        setTimeout(() => {
            generateResource(this.previewData, {
                type: 'application/json',
                hint: `framework-${new Date().toLocaleDateString()}.teq`,
                download: true
            });

            setTimeout(() => {
                this._overlayService.clear();
                this._canLeaveRouteService.canLeaveRoute$.next(true);
            }, 250);
        }, 500);
    }

    discardChanges(): void {
        this._canLeaveRouteService.canLeaveRoute$.next(true);
        this.closeModal();
    }

    closeModal(): void {
        this._overlayService.remove(this.registrationId);
    }
}
