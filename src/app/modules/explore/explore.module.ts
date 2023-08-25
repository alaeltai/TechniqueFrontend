import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ExploreComponent } from '@teq/modules/explore/explore.component';
import { ExploreRoutingModule } from '@teq/modules/explore/explore-routing.module';
import { PhaseCardComponent } from './components/phase-card/phase-card.component';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { BadgeComponent } from '@teq/shared/components/badge/badge.component';
import { SubphaseTabComponent } from './components/subphase-tab/subphase-tab.component';
import { FiltersComponent } from '@teq/shared/components/filters/filters.component';
import { APIState } from '@teq/shared/states/api/api.state';
import { InformationProviderComponent } from '@teq/shared/components/information-provider/information-provider.component';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { PhaseHoverDirective } from '@teq/modules/explore/directives/phase-hover.directive';
import { TreeViewerComponent } from '@teq/shared/components/tree-viewer/tree-viewer.component';
import { MethodComponent } from '@teq/shared/components/tree-viewer/components/method/method.component';
import { PhaseComponent } from '@teq/shared/components/tree-viewer/components/phase/phase.component';
import { RolesContainerComponent } from './components/roles-container/roles-container.component';
import { ToggleComponent } from '@teq/shared/components/toggle/toggle.component';

@NgModule({
    declarations: [ExploreComponent, PhaseCardComponent, SubphaseTabComponent, PhaseHoverDirective, RolesContainerComponent],
    imports: [
        CommonModule,
        ExploreRoutingModule,
        NgxsModule.forFeature([APIState]),
        LabelComponent,
        BadgeComponent,
        FiltersComponent,
        IconComponent,
        InformationProviderComponent,
        TreeViewerComponent,
        MethodComponent,
        PhaseComponent,
        ToggleComponent
    ],
    exports: [ExploreComponent]
})
export class ExploreModule {}
