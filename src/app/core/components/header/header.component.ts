import { Component } from '@angular/core';
import { AuthService } from '@teq/modules/auth/state/auth.service';
import { fadeIn } from '@teq/shared/animations/animations.lib';

@Component({
    selector: 'teq-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [fadeIn]
})
export class HeaderComponent {
    public readonly authenticated$ = this._authService.authenticated$;

    constructor(private readonly _authService: AuthService) {}
}
