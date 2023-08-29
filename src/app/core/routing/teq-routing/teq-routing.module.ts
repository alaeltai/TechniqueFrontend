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
        title: 'Technique',
        loadChildren: async () => (await import('@teq/modules/landing-page/landing-page.module')).LandingPageModule
    },
    {
        path: `${TeqRoutesEnum.PREVIEW}/:id`,
        title: 'Technique - Preview',
        loadChildren: async () => (await import('@teq/modules/preview/preview.module')).PreviewModule
    },
    {
        path: TeqRoutesEnum.VIEW_FRAMEWORK,
        canActivate: [isAuthenticatedGuard],
        title: 'Technique - View full framework',
        loadChildren: async () => (await import('@teq/modules/framework/framework.module')).FrameworkModule
    },
    {
        path: TeqRoutesEnum.CREATE,
        canActivate: [isAuthenticatedGuard],
        title: 'Technique - Create',
        loadChildren: async () => (await import('@teq/modules/create/create.module')).CreateModule
    },
    {
        path: TeqRoutesEnum.EXPLORE,
        canActivate: [isAuthenticatedGuard],
        title: 'Technique - Explore',
        loadChildren: async () => (await import('@teq/modules/explore/explore.module')).ExploreModule
    },
    {
        path: TeqRoutesEnum.IMPORT,
        canActivate: [isAuthenticatedGuard],
        title: 'Technique - Import',
        loadChildren: async () => (await import('@teq/modules/import-framework/import-framework.module')).ImportFrameworkModule
    },
    {
        path: TeqRoutesEnum.ROLES,
        canActivate: [isAuthenticatedGuard],
        title: 'Technique - Roles',
        loadChildren: async () => (await import('@teq/modules/roles/roles.module')).RolesModule
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
