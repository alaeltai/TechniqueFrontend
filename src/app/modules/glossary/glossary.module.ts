import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideListComponent } from '@teq/shared/components/side-list/side-list.component';
import { GlossaryComponent } from './glossary.component';
import { GlossaryRoutingModule } from './glossary-routing.module';

@NgModule({
    declarations: [GlossaryComponent],
    imports: [CommonModule, GlossaryRoutingModule, SideListComponent],
    exports: [GlossaryComponent]
})
export class GlossaryModule {}
