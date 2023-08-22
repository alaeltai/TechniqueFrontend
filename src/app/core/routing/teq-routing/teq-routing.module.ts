import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from '@teq/core/guards/is-authenticated.guard';
import { TeqRoutesEnum } from '@teq/core/routing/teq-routing/teq-routes.enum';

const routes: Routes = [
    {
        path: TeqRoutesEnum.AUTH,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/auth/auth.module')).AuthModule
    },
    {
        path: TeqRoutesEnum.LANDING_PAGE,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/landing-page/landing-page.module')).LandingPageModule
    },
    {
        path: TeqRoutesEnum.PREVIEW,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/preview/preview.module')).PreviewModule
    },
    {
        path: TeqRoutesEnum.VIEW_FRAMEWORK,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/framework/framework.module')).FrameworkModule
    },
    {
        path: TeqRoutesEnum.EXPLORE,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/explore/explore.module')).ExploreModule
    },
    {
        path: TeqRoutesEnum.IMPORT,
        canActivate: [isAuthenticatedGuard],
        loadChildren: async () => (await import('@teq/modules/import-framework/import-framework.module')).ImportFrameworkModule
    },
    {
        path: '**',
        redirectTo: TeqRoutesEnum.LANDING_PAGE
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class TeqRoutingModule {}
