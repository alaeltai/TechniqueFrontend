import { NgModule } from '@angular/core';
import { AppComponent } from '@teq/app.component';
import { CoreModule } from '@teq/core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';

import { MSALInstanceFactory } from './app.msal.factory';
import { httpInterceptorProviders } from './core/inteceptors';
import { IntersectionObserverDirective } from './shared/directives/intersection-observer';

@NgModule({
    declarations: [AppComponent, IntersectionObserverDirective],
    imports: [
        CoreModule,
        HttpClientModule,
        NgxsModule.forRoot(),
        NgxsResetPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
        MsalModule
    ],
    providers: [
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        httpInterceptorProviders,
        MsalService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
