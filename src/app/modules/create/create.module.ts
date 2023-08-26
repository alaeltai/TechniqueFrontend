import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { CreateComponent } from './create.component';
import { CreateRoutingModule } from './create-routing.module';
import { ColumnViewerComponent } from '@teq/shared/components/column-viewer/column-viewer.component';
import { NgxsModule } from '@ngxs/store';
import { APIState } from '@teq/shared/states/api/api.state';

@NgModule({
    declarations: [CreateComponent],
    imports: [CommonModule, CreateRoutingModule, ColumnViewerComponent, NgxsModule.forFeature([APIState])],
    providers: [FiltersService],
    exports: [CreateComponent]
})
export class CreateModule {}
