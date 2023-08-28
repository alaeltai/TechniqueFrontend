import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { generateResource } from '@teq/shared/lib/resource.lib';
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

    constructor(private readonly _overlayService: OverlayService, private readonly _router: Router) {}

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

            setTimeout(() => this._overlayService.remove(this._resourceGenerationOverlay), 250);
        }, 500);
    }

    discardChanges(): void {
        this.closeModal();
        void this._router.navigate(['/landing-page']);
    }

    closeModal(): void {
        this._overlayService.remove(this.registrationId);
    }
}
