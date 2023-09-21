import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export const canDeactivateCreateGuard: CanDeactivateFn<DeactivatableComponent> = (component: DeactivatableComponent) => {
    if (component.canDeactivate) {
        return component.canDeactivate();
    }
    return true;
};

export interface DeactivatableComponent {
    canDeactivate: () => boolean | Observable<boolean>;
}
