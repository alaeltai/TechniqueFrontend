import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { ExploreComponent } from '@teq/modules/explore/explore.component';
import { ExploreRoutingModule } from '@teq/modules/explore/explore-routing.module';
import { APIState } from '@teq/shared/states/api/api.state';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { ColumnViewerComponent } from '@teq/shared/components/column-viewer/column-viewer.component';

@NgModule({
    declarations: [ExploreComponent],
    imports: [CommonModule, ExploreRoutingModule, NgxsModule.forFeature([APIState]), ColumnViewerComponent],
    providers: [FiltersService],
    exports: [ExploreComponent]
})
export class ExploreModule {}
