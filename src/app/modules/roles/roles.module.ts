import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { APIState } from '@teq/shared/states/api/api.state';
import { ColumnViewerComponent } from '@teq/shared/components/column-viewer/column-viewer.component';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';

@NgModule({
    declarations: [RolesComponent],
    imports: [CommonModule, RolesRoutingModule, NgxsModule.forFeature([APIState]), ColumnViewerComponent],
    exports: [RolesComponent]
})
export class RolesModule {}
