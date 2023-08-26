import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { RouterModule } from '@angular/router';
import { TreePreviewerComponent } from '@teq/shared/components/tree-previewer/tree-previewer.component';

@NgModule({
    declarations: [PreviewComponent],
    imports: [
        CommonModule,
        TreePreviewerComponent,
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
