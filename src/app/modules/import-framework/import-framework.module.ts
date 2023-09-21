import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { APIState } from '@teq/shared/states/api/api.state';
import { IconComponent } from '@teq/shared/components/icon/icon.component';
import { ImportFrameworkComponent } from '@teq/modules/import-framework/import-framework.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { RouterModule } from '@angular/router';
import { DropZoneComponent } from './components/dropzone/dropzone.component';
import { DragAndDropDirective } from '@teq/modules/import-framework/directives/drag-and-drop.directive';

@NgModule({
    declarations: [ImportFrameworkComponent, ProgressBarComponent, DropZoneComponent, DragAndDropDirective],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ImportFrameworkComponent
            }
        ]),
        NgxsModule.forFeature([APIState]),
        LabelComponent,
        IconComponent
    ],
    exports: [ImportFrameworkComponent]
})
export class ImportFrameworkModule {}
