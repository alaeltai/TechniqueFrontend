import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkComponent } from '@teq/modules/framework/framework.component';
import { FrameworkRoutingModule } from '@teq/modules/framework/framework-routing.module';
import { FrameworkService } from '@teq/modules/framework/state/framework.service';
import { FrameworkState } from '@teq/modules/framework/state/framework.state';
import { NgxsModule } from '@ngxs/store';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { BadgeComponent } from '@teq/shared/components/badge/badge.component';
import { PaginationComponent } from '@teq/shared/components/pagination/pagination.component';
import { SVGRendererComponent } from '@teq/shared/components/svg/svg.component';
import { APIService } from '@teq/shared/states/api/api.service';
import { APIState } from '@teq/shared/states/api/api.state';
import { TreeViewerComponent } from '@teq/shared/components/tree-viewer/tree-viewer.component';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { OverlayComponent } from '@teq/shared/components/overlay/overlay.component';

@NgModule({
    declarations: [FrameworkComponent],
    imports: [
        CommonModule,
        FrameworkRoutingModule,
        NgxsModule.forFeature([FrameworkState]),
        NgxsModule.forFeature([APIState]),
        LabelComponent,
        BadgeComponent,
        PaginationComponent,
        SVGRendererComponent,
        IconComponent,
        TreeViewerComponent,
        OverlayComponent
    ],
    exports: [FrameworkComponent],
    providers: [FrameworkService, APIService]
})
export class FrameworkModule {}
