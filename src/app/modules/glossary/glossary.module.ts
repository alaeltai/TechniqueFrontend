import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideListComponent } from '@teq/shared/components/side-list/side-list.component';
import { GlossaryComponent } from './glossary.component';
import { GlossaryRoutingModule } from './glossary-routing.module';
import { SelectComponent } from '@teq/shared/components/select/select.component';
import { SideContentComponent } from '@teq/shared/components/side-content/side-content.component';

@NgModule({
    declarations: [GlossaryComponent],
    imports: [CommonModule, GlossaryRoutingModule, SideListComponent, SelectComponent, SideContentComponent],
    exports: [GlossaryComponent]
})
export class GlossaryModule {}
