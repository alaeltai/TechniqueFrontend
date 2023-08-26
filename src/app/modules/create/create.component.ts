import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent {
    public disableMap: Record<string, boolean> = {};

    constructor(private readonly _router: Router) {
        const route = this._router.getCurrentNavigation();

        if (route) {
            const state = route.extras.state;

            if (state) {
                if (state['imported']) {
                    this.disableMap = state['imported'] as Record<string, boolean>;
                }
            }
        }
    }
}
