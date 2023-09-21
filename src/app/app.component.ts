import { Component } from '@angular/core';
import { OverlayService } from '@teq/shared/services/overlay.service';

@Component({
    selector: 'teq-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Technique';

    get overlayActive(): boolean {
        return this._overlayService.active;
    }

    constructor(private readonly _overlayService: OverlayService) {}
}
