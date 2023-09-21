import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutesEnum } from '@teq/modules/auth/auth-routes.enum';
import { AuthComponent } from '@teq/modules/auth/auth.component';
import { LoginComponent } from '@teq/modules/auth/pages/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: AuthRoutesEnum.LOGIN,
                pathMatch: 'full'
            },
            {
                path: AuthRoutesEnum.LOGIN,
                component: LoginComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: AuthRoutesEnum.LOGIN
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
