import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create.component';
import { canDeactivateCreateGuard } from '@teq/core/guards/can-deactivate-create.guard';

const routes: Routes = [
    {
        path: '',
        component: CreateComponent,
        canDeactivate: [canDeactivateCreateGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CreateRoutingModule {}
