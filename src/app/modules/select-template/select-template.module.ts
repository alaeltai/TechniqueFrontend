import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SelectTemplateComponent } from './select-template.component';
import { ColorBarComponent } from '@teq/shared/components/color-bar/color-bar.component';
import { TemplateCardComponent } from './components/template-card/template-card.component';
import { SelectTemplateState } from '@teq/modules/select-template/state/select-template.state';
import { NgxsModule } from '@ngxs/store';
import { SelectTemplateService } from '@teq/modules/select-template/state/select-template.service';
import { SelectTemplateControllerService } from '@teq/modules/select-template/state/select-template-controller.service';
import { IconComponent } from '@teq/shared/components/icon/icon.component';

@NgModule({
    declarations: [SelectTemplateComponent, TemplateCardComponent],
    imports: [
        CommonModule,
        NgxsModule.forFeature([SelectTemplateState]),
        RouterModule.forChild([
            {
                path: '',
                component: SelectTemplateComponent
            }
        ]),
        ColorBarComponent,
        IconComponent
    ],
    exports: [SelectTemplateComponent],
    providers: [SelectTemplateService, SelectTemplateControllerService]
})
export class SelectTemplateModule {}
