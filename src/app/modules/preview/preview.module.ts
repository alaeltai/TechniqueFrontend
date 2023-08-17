import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { RouterModule } from '@angular/router';
import { TreeViewerComponent } from '@teq/shared/components/tree-viewer/tree-viewer.component';

@NgModule({
    declarations: [PreviewComponent],
    imports: [
        CommonModule,
        TreeViewerComponent,
        RouterModule.forChild([
            {
                path: '',
                component: PreviewComponent
            }
        ])
    ],
    exports: [PreviewComponent],
    providers: []
})
export class PreviewModule {}
