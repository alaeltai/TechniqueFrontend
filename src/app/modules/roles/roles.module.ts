import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { APIState } from '@teq/shared/states/api/api.state';
import { ColumnViewerComponent } from '@teq/shared/components/column-viewer/column-viewer.component';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';
import { SideListComponent } from '@teq/shared/components/side-list/side-list.component';
import { TabsComponent } from '@teq/shared/components/tabs/tabs.component';
import { SubphaseTabComponent } from '@teq/shared/components/column-viewer/components/subphase-tab/subphase-tab.component';
import { PhaseTabComponent } from '@teq/shared/components/phase-tab/phase-tab.component';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { TableComponent } from '@teq/shared/components/table/table.component';

@NgModule({
    declarations: [RolesComponent],
    imports: [
        CommonModule,
        RolesRoutingModule,
        NgxsModule.forFeature([APIState]),
        ColumnViewerComponent,
        SideListComponent,
        TabsComponent,
        SubphaseTabComponent,
        PhaseTabComponent,
        IconComponent,
        TableComponent
    ],
    exports: [RolesComponent]
})
export class RolesModule {}
