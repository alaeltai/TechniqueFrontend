import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideListComponent } from '@teq/shared/components/side-list/side-list.component';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { SelectComponent } from '@teq/shared/components/select/select.component';

@NgModule({
    declarations: [FaqComponent],
    imports: [CommonModule, FaqRoutingModule, SideListComponent, SelectComponent],
    exports: [FaqComponent]
})
export class FaqModule {}
