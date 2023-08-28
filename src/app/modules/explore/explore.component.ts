import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeIn } from '@teq/shared/animations/animations.lib';
import { TreeBasedPageComponent } from '@teq/shared/components/tree-based-page/tree-based-page';
@UntilDestroy()
@Component({
    selector: 'teq-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    animations: [fadeIn]
})
export class ExploreComponent extends TreeBasedPageComponent {}
