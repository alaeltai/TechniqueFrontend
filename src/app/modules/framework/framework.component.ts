import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
@UntilDestroy()
@Component({
    selector: 'teq-framework',
    templateUrl: './framework.component.html',
    styleUrls: ['./framework.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn]
})
export class FrameworkComponent extends TreeBasedPageComponent {
    public readonly phases$ = this._apiService.phases$;
}
